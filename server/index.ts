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

const allowedOrigins: (string | RegExp)[] = [
  'http://localhost:5173',
  'http://localhost:4173',
  'capacitor://localhost',
  'https://localhost',
  /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,  // LAN access from physical device
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({ origin: allowedOrigins, credentials: true }));
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

// Telegram Webhook Sync
async function syncTelegramWebhook(flow: any) {
  const triggerNode = (flow.nodes as any[]).find((n: any) => n.type === 'trigger_telegram');
  if (triggerNode && triggerNode.config?.token) {
    const token = triggerNode.config.token;
    const webhookUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/webhook/telegram/${flow.id}`;
    
    try {
      if (flow.enabled) {
        console.log(`📡 Setting Telegram Webhook for flow "${flow.name}" to: ${webhookUrl}`);
        await axios.post(`https://api.telegram.org/bot${token}/setWebhook`, { url: webhookUrl });
      } else {
        console.log(`🔌 Deleting Telegram Webhook for flow "${flow.name}"`);
        await axios.post(`https://api.telegram.org/bot${token}/deleteWebhook`);
      }
    } catch (err: any) {
      console.error(`❌ Telegram Webhook Sync failed for flow "${flow.name}":`, err.message);
    }
  }
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
        // Map top-level initialContext into per-node context so {{nodeId.field}} variables resolve
        if (node.type === 'trigger_telegram') {
          log.context[node.id] = initialContext.telegram || {};
        } else if (node.type === 'trigger_sheets') {
          log.context[node.id] = initialContext.sheets || {};
        } else if (node.type === 'trigger_schedule') {
          log.context[node.id] = { timestamp: new Date().toISOString() };
        }
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
            let { apiKey, prompt, model, provider, credentialId } = node.config;
            const resolvedPrompt = resolveVariables(prompt, log.context);
            
            // Default to OpenAI if no provider specified
            provider = provider || 'openai';
            
            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred) apiKey = cred.api_key;
            }

            let content = '';
            
            if (provider === 'openai') {
              const openai = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
              const response = await openai.chat.completions.create({
                model: model || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: resolvedPrompt }],
              });
              content = response.choices[0]?.message?.content || '';
            } else if (provider === 'anthropic') {
              const anthropicKey = apiKey || process.env.ANTHROPIC_API_KEY;
              const anthropicRes = await axios.post('https://api.anthropic.com/v1/messages', {
                model: model || 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [{ role: 'user', content: resolvedPrompt }]
              }, {
                headers: {
                  'x-api-key': anthropicKey,
                  'anthropic-version': '2023-06-01',
                  'content-type': 'application/json'
                }
              });
              content = anthropicRes.data.content[0]?.text || '';
            } else if (provider === 'google') {
              const googleKey = apiKey || process.env.GOOGLE_API_KEY;
              const googleRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${googleKey}`, {
                contents: [{ parts: [{ text: resolvedPrompt }] }]
              }, {
                headers: { 'content-type': 'application/json' }
              });
              content = googleRes.data.candidates[0]?.content?.parts[0]?.text || '';
            } else if (provider === 'deepseek') {
              const deepseekKey = apiKey || process.env.DEEPSEEK_API_KEY;
              const deepseekRes = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                model: model || 'deepseek-chat',
                messages: [{ role: 'user', content: resolvedPrompt }]
              }, {
                headers: {
                  'Authorization': `Bearer ${deepseekKey}`,
                  'content-type': 'application/json'
                }
              });
              content = deepseekRes.data.choices[0]?.message?.content || '';
            } else if (provider === 'mistral') {
              const mistralKey = apiKey || process.env.MISTRAL_API_KEY;
              const mistralRes = await axios.post('https://api.mistral.ai/v1/chat/completions', {
                model: model || 'mistral-small-latest',
                messages: [{ role: 'user', content: resolvedPrompt }]
              }, {
                headers: {
                  'Authorization': `Bearer ${mistralKey}`,
                  'content-type': 'application/json'
                }
              });
              content = mistralRes.data.choices[0]?.message?.content || '';
            } else {
              // Default to OpenAI
              const openai = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
              const response = await openai.chat.completions.create({
                model: model || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: resolvedPrompt }],
              });
              content = response.choices[0]?.message?.content || '';
            }
            
            log.context[node.id] = { output: content };
            nodeLog.output = content;
            break;
          }

          case 'action_gmail': {
            const { to, subject, body, credentialId } = node.config;
            const resolvedTo = resolveVariables(to || '', log.context);
            const resolvedSubject = resolveVariables(subject || '', log.context);
            const resolvedBody = resolveVariables(body || '', log.context);

            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred && cred.provider === 'google') {
                const gmailOauth = new google.auth.OAuth2(
                  process.env.GOOGLE_CLIENT_ID,
                  process.env.GOOGLE_CLIENT_SECRET,
                  (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
                );
                gmailOauth.setCredentials(cred.meta);

                const gmail = google.gmail({ version: 'v1', auth: gmailOauth });
                const raw = Buffer.from(
                  `To: ${resolvedTo}\r\nSubject: ${resolvedSubject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${resolvedBody}`
                ).toString('base64url');
                await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
                log.context[node.id] = { success: true };
                nodeLog.output = `Email sent to ${resolvedTo}`;
              } else {
                throw new Error("Google account မချိတ်ဆက်ထားပါ");
              }
            } else {
              log.context[node.id] = { success: true };
              nodeLog.output = `Simulation: Email to ${resolvedTo} — ${resolvedSubject}`;
            }
            break;
          }

          case 'action_calendar': {
            const { summary, description, startTime, endTime, credentialId } = node.config;
            const resolvedSummary = resolveVariables(summary || '', log.context);
            const resolvedDescription = resolveVariables(description || '', log.context);

            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred && cred.provider === 'google') {
                const calOauth = new google.auth.OAuth2(
                  process.env.GOOGLE_CLIENT_ID,
                  process.env.GOOGLE_CLIENT_SECRET,
                  (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
                );
                calOauth.setCredentials(cred.meta);

                const calendar = google.calendar({ version: 'v3', auth: calOauth });
                const event = await calendar.events.insert({
                  calendarId: 'primary',
                  requestBody: {
                    summary: resolvedSummary,
                    description: resolvedDescription,
                    start: { dateTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString() },
                    end: { dateTime: endTime ? new Date(endTime).toISOString() : new Date(Date.now() + 3600000).toISOString() },
                  },
                });
                log.context[node.id] = { success: true, eventId: event.data.id };
                nodeLog.output = `Event created: ${resolvedSummary} (${event.data.htmlLink})`;
              } else {
                throw new Error("Google account မချိတ်ဆက်ထားပါ");
              }
            } else {
              log.context[node.id] = { success: true };
              nodeLog.output = `Simulation: Calendar event "${resolvedSummary}"`;
            }
            break;
          }

          case 'action_sheets': {
            const { sheetId, range, values, credentialId, operation = 'append', title, sheetName } = node.config;
            const resolvedValues = values ? resolveVariables(values, log.context).split(',').map((v: string) => v.trim()) : [];

            if (credentialId) {
              const creds = await CredentialModel.all();
              const cred = (creds as any[]).find(c => c.id === credentialId);
              if (cred && cred.provider === 'google') {
                const sheetsOauth = new google.auth.OAuth2(
                  process.env.GOOGLE_CLIENT_ID,
                  process.env.GOOGLE_CLIENT_SECRET,
                  (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
                );
                sheetsOauth.setCredentials(cred.meta);
                const sheets = google.sheets({ version: 'v4', auth: sheetsOauth });

                if (operation === 'append') {
                  await sheets.spreadsheets.values.append({
                    spreadsheetId: sheetId,
                    range: range || 'Sheet1!A1',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [resolvedValues] },
                  });
                  log.context[node.id] = { success: true, operation: 'append', values: resolvedValues };
                  nodeLog.output = `Appended: ${resolvedValues.join(', ')}`;

                } else if (operation === 'get') {
                  const res = await sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: range || 'Sheet1!A1:Z100',
                  });
                  const rows = res.data.values || [];
                  log.context[node.id] = { success: true, operation: 'get', rows, rowCount: rows.length };
                  nodeLog.output = `Got ${rows.length} rows from ${range}`;

                } else if (operation === 'update') {
                  await sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: range || 'Sheet1!A1',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values: [resolvedValues] },
                  });
                  log.context[node.id] = { success: true, operation: 'update', values: resolvedValues };
                  nodeLog.output = `Updated ${range}: ${resolvedValues.join(', ')}`;

                } else if (operation === 'create') {
                  const res = await sheets.spreadsheets.create({
                    requestBody: {
                      properties: { title: title || 'New Spreadsheet' },
                      sheets: [{ properties: { title: sheetName || 'Sheet1' } }],
                    },
                  });
                  const newId = res.data.spreadsheetId;
                  log.context[node.id] = { success: true, operation: 'create', spreadsheetId: newId };
                  nodeLog.output = `Created spreadsheet: ${title} (${newId})`;
                }
              } else {
                throw new Error("Google account မချိတ်ဆက်ထားပါ");
              }
            } else {
              // Simulation mode
              if (operation === 'get') {
                log.context[node.id] = { success: true, operation: 'get', rows: [['Sample', 'Data']], rowCount: 1 };
                nodeLog.output = `Simulation: Got 1 row`;
              } else if (operation === 'create') {
                log.context[node.id] = { success: true, operation: 'create', spreadsheetId: 'sim-id-123' };
                nodeLog.output = `Simulation: Created spreadsheet "${title || 'New Spreadsheet'}"`;
              } else {
                log.context[node.id] = { success: true, operation, values: resolvedValues };
                nodeLog.output = `Simulation: ${operation} — ${resolvedValues.join(', ')}`;
              }
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

// Health check endpoint (also used for keep-alive)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
  await syncTelegramWebhook(flow);
  await upsertSchedule(flow);
  res.json(flow);
});
app.delete('/api/flows/:id', async (req, res) => {
  await FlowModel.delete(req.params.id);
  removeSchedule(req.params.id);
  res.json({ success: true });
});

app.post('/api/flows/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const flow = await FlowModel.findById(id);
  if (flow) {
    const newStatus = !flow.enabled;
    await FlowModel.toggleEnabled(id, newStatus);
    const updatedFlow = { ...flow, enabled: newStatus };
    await syncTelegramWebhook(updatedFlow);
    await upsertSchedule(updatedFlow);
    res.json({ success: true, enabled: newStatus });
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
  const { state } = req.query;
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    prompt: 'consent',
    state: state as string || 'default',
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code, state } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    
    // Get user email using the access token
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    
    const userEmail = userInfoResponse.data.email;
    
    await CredentialModel.create({
      name: userEmail || 'Google Account',
      provider: 'google',
      apiKey: tokens.refresh_token || '',
      meta: tokens,
      baseUrl: null,
    });
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { text-align: center; padding: 40px; }
            .success { font-size: 48px; margin-bottom: 16px; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            p { color: #94a3b8; margin-bottom: 24px; }
            button { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h1>အောင်မြင်ပါပီး!</h1>
            <p>Google Account ချိတ်ဆက်ပြီးပါပါပီး။</p>
            <button onclick="window.close()">ပို့လိုက်ပါမည်</button>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { text-align: center; padding: 40px; }
            .error { font-size: 48px; margin-bottom: 16px; }
            h1 { font-size: 24px; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">❌</div>
            <h1>ချိတ်ဆက်မှုမအောင်မြင်ပါ။</h1>
          </div>
        </body>
      </html>
    `);
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

async function upsertSchedule(flow: any) {
  // Remove existing if any
  if (activeCrons.has(flow.id)) {
    activeCrons.get(flow.id).stop();
    activeCrons.delete(flow.id);
  }

  const scheduleTrigger = (flow.nodes as any[]).find((n: any) => n.type === 'trigger_schedule');
  if (scheduleTrigger && scheduleTrigger.config.cron && flow.enabled) {
    console.log(`⏰ Scheduling flow: ${flow.name} (${scheduleTrigger.config.cron})`);
    const task = cron.schedule(scheduleTrigger.config.cron, () => {
      console.log(`Running scheduled flow: ${flow.name}`);
      executeFlow(flow, { trigger: 'schedule' });
    });
    activeCrons.set(flow.id, task);
    return;
  }

  // Google Sheets polling trigger — check every 5 minutes for new rows
  const sheetsTrigger = (flow.nodes as any[]).find((n: any) => n.type === 'trigger_sheets');
  if (sheetsTrigger && sheetsTrigger.config.sheetId && sheetsTrigger.config.credentialId && flow.enabled) {
    console.log(`📊 Setting up Sheets polling for flow: ${flow.name}`);
    let lastRowCount: number | null = null;

    const task = cron.schedule('*/5 * * * *', async () => {
      try {
        const creds = await CredentialModel.all();
        const cred = (creds as any[]).find(c => c.id === sheetsTrigger.config.credentialId);
        if (!cred || cred.provider !== 'google') return;

        const sheetsOauth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          (process.env.BASE_URL || 'http://localhost:3001') + '/auth/google/callback'
        );
        sheetsOauth.setCredentials(cred.meta);
        const sheets = google.sheets({ version: 'v4', auth: sheetsOauth });
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetsTrigger.config.sheetId,
          range: sheetsTrigger.config.range || 'Sheet1!A:A',
        });
        const rows = res.data.values || [];
        if (lastRowCount === null) {
          lastRowCount = rows.length;
          return;
        }
        if (rows.length > lastRowCount) {
          const newRows = rows.slice(lastRowCount);
          lastRowCount = rows.length;
          console.log(`📊 New rows detected in Sheets trigger for flow: ${flow.name}`);
          executeFlow(flow, { sheets: { newRows, allRows: rows } });
        }
      } catch (err: any) {
        console.error(`Sheets polling error for flow "${flow.name}":`, err.message);
      }
    });
    activeCrons.set(flow.id, task);
  }
}

function removeSchedule(id: string) {
  if (activeCrons.has(id)) {
    activeCrons.get(id).stop();
    activeCrons.delete(id);
  }
}

async function setupSchedules() {
  console.log("⏰ Setting up schedules...");
  const flows = await FlowModel.all();
  console.log(`📊 Found ${flows.length} flows to check for schedules.`);
  flows.forEach(flow => {
    upsertSchedule(flow);
  });
  console.log("✅ Schedules setup complete.");
}

async function setupWebhooks() {
  console.log("📡 Syncing Telegram webhooks...");
  const flows = await FlowModel.all();
  for (const flow of flows) {
    if (flow.enabled) {
      await syncTelegramWebhook(flow);
    }
  }
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
    await setupWebhooks();
    
    // Keep-alive: ping self every 14 min to prevent Render free tier spin-down
    if (process.env.BASE_URL) {
      cron.schedule('*/14 * * * *', async () => {
        try {
          await axios.get(`${process.env.BASE_URL}/api/health`);
          console.log('💓 Keep-alive ping sent');
        } catch {
          console.warn('⚠️ Keep-alive ping failed');
        }
      });
    }

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
