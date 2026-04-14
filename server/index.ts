import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';
import { OpenAI } from 'openai';
import { google } from 'googleapis';
import { FlowModel, LogModel, IdempotencyModel, CredentialModel, initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper for variable substitution
function resolveVariables(text: string, data: any) {
  if (!text) return '';
  return text.replace(/{{(.*?)}}/g, (match, path) => {
    const parts = path.trim().split('.');
    let current = data;
    for (const part of parts) {
      current = current?.[part];
    }
    return current !== undefined ? String(current) : match;
  });
}

// Execution Engine
async function executeFlow(flow: any, initialContext: any = {}) {
  const logId = Math.random().toString(36).substring(7);
  const log: any = { 
    id: logId, 
    flowId: flow.id, 
    flowName: flow.name, 
    startTime: new Date().toISOString(), 
    steps: [], 
    status: 'running',
    context: initialContext 
  };
  
  await LogModel.create(log);

  try {
    for (const node of flow.nodes) {
      if (node.type.startsWith('trigger')) {
        log.steps.push({ nodeId: node.id, nodeName: node.name, status: 'success', timestamp: new Date().toISOString() });
        continue;
      }

      const stepStart = Date.now();
      const nodeLog: any = { nodeId: node.id, nodeName: node.name, status: 'processing' };
      log.steps.push(nodeLog);

      try {
        switch (node.type) {
          case 'action_condition': {
            const { input, operator, value } = node.config;
            const resolvedInput = resolveVariables(input || '', log.context);
            const resolvedValue = resolveVariables(value || '', log.context);
            
            let passed = false;
            switch(operator) {
              case 'equals': passed = resolvedInput === resolvedValue; break;
              case 'not_equals': passed = resolvedInput !== resolvedValue; break;
              case 'contains': passed = resolvedInput.includes(resolvedValue); break;
              case 'exists': passed = !!resolvedInput && resolvedInput.trim() !== ''; break;
              default: passed = true;
            }
            
            log.context[node.id] = { success: true, passed };
            nodeLog.output = `Condition ${passed ? 'PASSED' : 'FAILED'}: "${resolvedInput}" ${operator} "${resolvedValue}"`;
            
            if (!passed) {
              console.log(`Flow stopped at ${node.name} due to condition failure.`);
              return; // STOP FLOW
            }
            break;
          }
          case 'action_telegram': {
            const token = resolveVariables(node.config.token, log.context);
            const chatId = resolveVariables(node.config.chatId, log.context);
            const message = resolveVariables(node.config.message, log.context);

            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
              chat_id: chatId,
              text: message
            });
            log.context[node.id] = { success: true };
            break;
          }

          case 'action_agent': {
            let { apiKey, prompt, model, credentialId } = node.config;
            
            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred) apiKey = cred.api_key;
            }

            const resolvedPrompt = resolveVariables(prompt, log.context);
            const openai = new OpenAI({ apiKey });
            const response = await openai.chat.completions.create({
              model: model || 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: resolvedPrompt }],
            });

            const content = response.choices[0]?.message?.content;
            log.context[node.id] = { output: content };
            nodeLog.output = content;
            break;
          }

          case 'action_sheets': {
            const { sheetId, range, values, credentialId } = node.config;
            const resolvedValues = values ? resolveVariables(values, log.context).split(',').map((v: string) => v.trim()) : [];
            
            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred && cred.provider === 'google') {
                const triggerOauth = new google.auth.OAuth2(
                  process.env.GOOGLE_CLIENT_ID,
                  process.env.GOOGLE_CLIENT_SECRET,
                  (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
                );
                triggerOauth.setCredentials(cred.meta);
                
                const sheets = google.sheets({ version: 'v4', auth: triggerOauth });
                await sheets.spreadsheets.values.append({
                  spreadsheetId: sheetId,
                  range: range || 'Sheet1!A1',
                  valueInputOption: 'USER_ENTERED',
                  requestBody: { values: [resolvedValues] },
                });
                
                log.context[node.id] = { success: true, appended: resolvedValues };
                nodeLog.output = `အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ: ${resolvedValues.join(', ')}`;
              } else {
                throw new Error("Google account မချိတ်ဆက်ထားပါ");
              }
            } else {
              log.context[node.id] = { success: true, appended: resolvedValues };
              nodeLog.output = `Simulation: Appended ${resolvedValues.join(', ')}`;
            }
            break;
          }

          default:
            nodeLog.status = 'skipped';
        }
        nodeLog.status = 'success';
        nodeLog.duration = Date.now() - stepStart;
      } catch (err: any) {
        nodeLog.status = 'error';
        nodeLog.error = err.message;
        throw err;
      }
    }
    log.status = 'completed';
  } catch (err: any) {
    log.status = 'failed';
    log.error = err.message;
  } finally {
    await LogModel.update(log.id, log);
  }
}

// Routes
app.post('/webhook/telegram/:flowId', async (req, res) => {
  const { flowId } = req.params;
  const updateId = req.body.update_id;

  if (updateId && await IdempotencyModel.isProcessed(updateId)) {
    return res.status(200).json({ success: true, message: "Duplicate" });
  }

  const flow = await FlowModel.findById(flowId);
  if (flow && flow.enabled) {
    const triggerNode = (flow.nodes as any[]).find((n: any) => n.type === 'trigger_telegram');
    const incomingText = req.body.message?.text;
    const triggerCommand = triggerNode?.config?.command;

    // Command matching
    if (triggerCommand && incomingText !== triggerCommand) {
      return res.status(200).json({ success: true, message: "Command mismatch" });
    }

    if (updateId) await IdempotencyModel.markProcessed(updateId);
    
    // Auto Reply
    if (triggerNode?.config?.autoReply && req.body.message?.chat?.id) {
      const token = triggerNode.config.token;
      axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: req.body.message.chat.id,
        text: resolveVariables(triggerNode.config.autoReply, { telegram: req.body })
      }).catch(e => console.error("Auto reply failed", e.message));
    }

    res.json({ success: true });
    executeFlow(flow, { telegram: req.body });
  } else {
    res.status(404).json({ error: "Flow not found" });
  }
});

app.get('/api/flows', async (req, res) => res.json(await FlowModel.all()));
app.post('/api/flows', async (req, res) => {
  const flow = await FlowModel.create(req.body);
  res.json(flow);
});
app.delete('/api/flows/:id', async (req, res) => {
  await FlowModel.delete(req.params.id);
  res.json({ success: true });
});

app.post('/api/flows/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const flow = await FlowModel.findById(id);
  if (flow) {
    await FlowModel.toggleEnabled(id, !flow.enabled);
    res.json({ success: true, enabled: !flow.enabled });
  } else {
    res.status(404).json({ error: "Flow not found" });
  }
});

app.get('/api/logs', async (req, res) => res.json(await LogModel.all()));

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
);

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
    prompt: 'consent'
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    // Create credential
    await CredentialModel.create({
      name: 'Google Sheets (OAuth)',
      provider: 'google',
      apiKey: tokens.refresh_token || '',
      meta: tokens
    });
    res.send('<script>window.close();</script> Authentication successful! You can close this window.');
  } catch (err) {
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/credentials', async (req, res) => res.json(await CredentialModel.all()));
app.post('/api/credentials', async (req, res) => res.json(await CredentialModel.create(req.body)));
app.delete('/api/credentials/:id', async (req, res) => {
  await CredentialModel.delete(req.params.id);
  res.json({ success: true });
});

// Initialize Schedules
const activeCrons = new Map();

async function setupSchedules() {
  console.log("⏰ Setting up schedules...");
  const flows = await FlowModel.all();
  console.log(`📊 Found ${flows.length} flows to check for schedules.`);
  flows.forEach(flow => {
    const trigger = (flow.nodes as any[]).find((n: any) => n.type === 'trigger_schedule');
    if (trigger && trigger.config.cron && flow.enabled) {
      console.log(`   - Scheduling flow: ${flow.name} (${trigger.config.cron})`);
      const task = cron.schedule(trigger.config.cron, () => {
        console.log(`Running scheduled flow: ${flow.name}`);
        executeFlow(flow, { trigger: 'schedule' });
      });
      activeCrons.set(flow.id, task);
    }
  });
  console.log("✅ Schedules setup complete.");
}

// Uncaught Error Handlers
process.on('uncaughtException', (err) => {
  console.error('🔥 CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
async function start() {
  console.log("🚀 Starting Mobile Automation Server...");
  console.log("📂 Environment Check:", {
    HAS_DB_URL: !!process.env.DATABASE_URL,
    DATABASE_URL_START: process.env.DATABASE_URL?.substring(0, 15) + "...",
    PORT: PORT
  });

  try {
    await initDb();
    await setupSchedules();
    
    app.listen(PORT, () => {
      console.log(`✨ Server is LIVE on port ${PORT}`);
      console.log(`👉 API Base: ${process.env.BASE_URL || 'http://localhost:' + PORT}`);
    });
  } catch (err: any) {
    console.error("💥 BOOM! Server failed to start:");
    console.error(err);
    process.exit(1);
  }
}

start().catch(err => console.error("Startup failed", err));
