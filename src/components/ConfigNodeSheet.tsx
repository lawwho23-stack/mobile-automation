import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { FlowNode } from '../store/flowStore';
import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import { VariablePicker } from './VariablePicker';

interface ConfigNodeSheetProps {
  node: FlowNode | null;
  onClose: () => void;
  onSave: (id: string, config: Record<string, any>) => void;
}

// Sub-components for better organization (Karpathy Guidelines: Simplicity First)

function TriggerScheduleForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">သတ်မှတ်ချက် (Cron Expression)</label>
        <input 
          type="text" 
          value={config.cron || '0 9 * * *'}
          onChange={(e) => onChange({...config, cron: e.target.value})}
          placeholder="0 9 * * *"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="text-xs text-slate-500 mt-1">ဥပမာ- '0 9 * * *' သည် နေ့စဉ် မနက် ၉ နာရီတွင် အလုပ်လုပ်ပါမည်။</p>
      </div>
    </div>
  );
}

function TriggerTelegramForm({ config, onChange, nodeId }: { config: any, onChange: (c: any) => void, nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Bot Token</label>
        <input 
          type="text" 
          value={config.token || ''}
          onChange={(e) => onChange({...config, token: e.target.value})}
          placeholder="123456:ABC-DEF..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">စတင်စေမည့် စာသား (Trigger Command)</label>
        <input 
          type="text" 
          value={config.command || '/start'}
          onChange={(e) => onChange({...config, command: e.target.value})}
          placeholder="/start"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">အော်တိုပြန်စာ (Auto Reply)</label>
        <input 
          type="text" 
          value={config.autoReply || ''}
          onChange={(e) => onChange({...config, autoReply: e.target.value})}
          placeholder="မင်္ဂလာပါ..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, autoReply: (config.autoReply || '') + v})} />
    </div>
  );
}

function ActionSheetsForm({ config, onChange, credentials, nodeId }: { config: any, onChange: (c: any) => void, credentials: any[], nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">အသုံးပြုမည့် Google Account</label>
        <select 
          value={config.credentialId || ''}
          onChange={(e) => onChange({...config, credentialId: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Simulation (စမ်းသပ်ရန်)</option>
          {credentials.filter(c => c.provider === 'google').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Spreadsheet ID</label>
        <input 
          type="text" 
          value={config.sheetId || ''}
          onChange={(e) => onChange({...config, sheetId: e.target.value})}
          placeholder="1BxiMVs0XRY..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">ထည့်သွင်းမည့် အချက်အလက်များ (Values)</label>
        <input 
          type="text" 
          value={config.values || ''}
          onChange={(e) => onChange({...config, values: e.target.value})}
          placeholder="ဥပမာ- {{telegram.text}}, {{agent.output}}"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="text-[10px] text-slate-500 italic mt-1">ကော်မာ (,) ခြားပြီး ရေးပေးပါ။</p>
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, values: (config.values || '') + (config.values ? ', ' : '') + v})} />
    </div>
  );
}

const AGENT_TEMPLATES = [
  { label: 'Summarize (အကျဉ်းချုပ်မည်)', prompt: 'Please summarize the following message in simple Burmese: {{input}}' },
  { label: 'Extract Order (အော်ဒါခွဲထုတ်မည်)', prompt: 'Extract product names, quantities, and customer info from this message as a clean list: {{input}}' },
  { label: 'Translate EN to MY (ဘာသာပြန်မည်)', prompt: 'Translate the following English text to natural Burmese: {{input}}' },
];

const AI_PROVIDERS = [
  { value: 'openai', label: 'OpenAI (GPT)', labelMy: 'OpenAI (GPT)' },
  { value: 'anthropic', label: 'Anthropic (Claude)', labelMy: 'Anthropic (Claude)' },
  { value: 'google', label: 'Google (Gemini)', labelMy: 'Google (Gemini)' },
  { value: 'deepseek', label: 'DeepSeek', labelMy: 'DeepSeek' },
  { value: 'mistral', label: 'Mistral', labelMy: 'Mistral' },
];

const AI_MODELS: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude 4 Sonnet' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ],
  google: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek Chat' },
    { value: 'deepseek-coder', label: 'DeepSeek Coder' },
  ],
  mistral: [
    { value: 'mistral-large-latest', label: 'Mistral Large' },
    { value: 'mistral-small-latest', label: 'Mistral Small' },
    { value: 'mistral-medium-latest', label: 'Mistral Medium' },
  ],
};

function ActionAgentForm({ config, onChange, credentials, nodeId }: { config: any, onChange: (c: any) => void, credentials: any[], nodeId: string }) {
  const lang = 'my';
  const currentProvider = config.provider || 'openai';
  const availableModels = AI_MODELS[currentProvider] || AI_MODELS.openai;
  
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">AI အမျိုးအစား</label>
        <select 
          value={config.provider || 'openai'}
          onChange={(e) => onChange({...config, provider: e.target.value, model: ''})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {AI_PROVIDERS.map(p => (
            <option key={p.value} value={p.value}>{p.labelMy}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Model ရွေးပါ</label>
        <select 
          value={config.model || ''}
          onChange={(e) => onChange({...config, model: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Default</option>
          {availableModels.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">သိမ်းထားသော Key</label>
        <select 
          value={config.credentialId || ''}
          onChange={(e) => onChange({...config, credentialId: e.target.value, apiKey: ''})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">အသစ်ထည့်မည် (Manual)</option>
          {credentials.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {!config.credentialId && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">API Key</label>
          <input 
            type="password" 
            value={config.apiKey || ''}
            onChange={(e) => onChange({...config, apiKey: e.target.value})}
            placeholder="sk-..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">AI ကိုခိုင်းစေမည့် ပါဝါ</label>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {AGENT_TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => onChange({...config, prompt: t.prompt})}
              className="text-[10px] px-2 py-1 bg-primary/10 border border-primary/20 rounded-md text-primary active:scale-95 transition-transform"
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea 
          value={config.prompt || ''}
          onChange={(e) => onChange({...config, prompt: e.target.value})}
          placeholder="ဘာလုပ်ပေးရမလဲ..."
          rows={4}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
        />
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, prompt: (config.prompt || '') + v})} />
    </div>
  );
}

function ActionTelegramForm({ config, onChange, nodeId }: { config: any, onChange: (c: any) => void, nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Bot Token</label>
        <input
          type="text"
          value={config.token || ''}
          onChange={(e) => onChange({...config, token: e.target.value})}
          placeholder="123456:ABC-DEF..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Chat ID</label>
        <input
          type="text"
          value={config.chatId || ''}
          onChange={(e) => onChange({...config, chatId: e.target.value})}
          placeholder="ဥပမာ- 123456789 သို့မဟုတ် {{telegram.message.chat.id}}"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">ပို့မည့် စာ (Message)</label>
        <textarea
          value={config.message || ''}
          onChange={(e) => onChange({...config, message: e.target.value})}
          placeholder="မင်္ဂလာပါ..."
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
        />
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, message: (config.message || '') + v})} />
    </div>
  );
}

function TriggerSheetsForm({ config, onChange, credentials }: { config: any, onChange: (c: any) => void, credentials: any[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Google Account</label>
        <select
          value={config.credentialId || ''}
          onChange={(e) => onChange({...config, credentialId: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Simulation (စမ်းသပ်ရန်)</option>
          {credentials.filter(c => c.provider === 'google').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Spreadsheet ID</label>
        <input
          type="text"
          value={config.sheetId || ''}
          onChange={(e) => onChange({...config, sheetId: e.target.value})}
          placeholder="1BxiMVs0XRY..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">စစ်ဆေးမည့် Range</label>
        <input
          type="text"
          value={config.range || 'Sheet1!A:A'}
          onChange={(e) => onChange({...config, range: e.target.value})}
          placeholder="Sheet1!A:A"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <p className="text-xs text-blue-400 leading-relaxed">
          ℹ️ ဤ trigger သည် မိနစ် ၅ တစ်ကြိမ် Sheet ကို စစ်ဆေးပြီး အသစ်ထည့်သောအတန်းများ ရှိပါက Flow ကို စတင်မည်။
        </p>
      </div>
    </div>
  );
}

function ActionCalendarForm({ config, onChange, credentials, nodeId }: { config: any, onChange: (c: any) => void, credentials: any[], nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Google Account</label>
        <select
          value={config.credentialId || ''}
          onChange={(e) => onChange({...config, credentialId: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Google Account ရွေးပါ</option>
          {credentials.filter(c => c.provider === 'google').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">ပွဲတော်ခေါင်းစဉ် (Event Title)</label>
        <input
          type="text"
          value={config.summary || ''}
          onChange={(e) => onChange({...config, summary: e.target.value})}
          placeholder="ဥပမာ- Meeting with {{telegram.message.from.first_name}}"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">ဖော်ပြချက် (Description)</label>
        <textarea
          value={config.description || ''}
          onChange={(e) => onChange({...config, description: e.target.value})}
          placeholder="ဥပမာ- {{agent.output}}"
          rows={2}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">စချိန် (Start)</label>
          <input
            type="datetime-local"
            value={config.startTime || ''}
            onChange={(e) => onChange({...config, startTime: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">ဆုံးချိန် (End)</label>
          <input
            type="datetime-local"
            value={config.endTime || ''}
            onChange={(e) => onChange({...config, endTime: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, summary: (config.summary || '') + v})} />
    </div>
  );
}

function ActionGmailForm({ config, onChange, credentials, nodeId }: { config: any, onChange: (c: any) => void, credentials: any[], nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Google Account</label>
        <select
          value={config.credentialId || ''}
          onChange={(e) => onChange({...config, credentialId: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Google Account ရွေးပါ</option>
          {credentials.filter(c => c.provider === 'google').map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">လက်ခံသူ (To)</label>
        <input
          type="email"
          value={config.to || ''}
          onChange={(e) => onChange({...config, to: e.target.value})}
          placeholder="example@gmail.com"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">ခေါင်းစဉ် (Subject)</label>
        <input
          type="text"
          value={config.subject || ''}
          onChange={(e) => onChange({...config, subject: e.target.value})}
          placeholder="ဥပမာ- အချက်အလက်အသစ်"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">အကြောင်းအရာ (Body)</label>
        <textarea
          value={config.body || ''}
          onChange={(e) => onChange({...config, body: e.target.value})}
          placeholder="ဥပမာ- {{agent.output}}"
          rows={4}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
        />
      </div>
      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, body: (config.body || '') + v})} />
    </div>
  );
}

function ConditionForm({ config, onChange, nodeId }: { config: any, onChange: (c: any) => void, nodeId: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">စစ်ဆေးမည့် အချက် (Value to Check)</label>
        <input 
          type="text" 
          value={config.input || ''}
          onChange={(e) => onChange({...config, input: e.target.value})}
          placeholder="ဥပမာ- {{agent.output}}"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">သတ်မှတ်ချက် (Operator)</label>
        <select 
          value={config.operator || 'contains'}
          onChange={(e) => onChange({...config, operator: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="contains">ပါဝင်လျှင် (Contains)</option>
          <option value="equals">တူညီလျှင် (Equals)</option>
          <option value="not_equals">မတူညီလျှင် (Not Equals)</option>
          <option value="exists">ရှိနေလျှင် (Is not empty)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">နှိုင်းယှဉ်သူ (Comparison Value)</label>
        <input 
          type="text" 
          value={config.value || ''}
          onChange={(e) => onChange({...config, value: e.target.value})}
          placeholder="ဥပမာ- Yes"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
        <p className="text-xs text-orange-400 leading-relaxed">
          ℹ️ ဤသတ်မှတ်ချက်နှင့် မကိုက်ညီပါက နောက်ထပ်လုပ်ဆောင်ချက်များကို ဆက်လက်လုပ်ဆောင်တော့မည် မဟုတ်ပါ။
        </p>
      </div>

      <VariablePicker currentNodeId={nodeId} onSelect={(v) => onChange({...config, input: (config.input || '') + v})} />
    </div>
  );
}

export function ConfigNodeSheet({ node, onClose, onSave }: ConfigNodeSheetProps) {
  const [configParams, setConfigParams] = useState<Record<string, any>>({});
  const { credentials, fetchCredentials } = useFlowStore();

  useEffect(() => {
    if (node) {
      setConfigParams(node.config || {});
      fetchCredentials();
    }
  }, [node, fetchCredentials]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, configParams);
    onClose();
  };

  const renderContent = () => {
    switch (node.type) {
      case 'trigger_schedule':
        return <TriggerScheduleForm config={configParams} onChange={setConfigParams} />;
      case 'trigger_telegram':
        return <TriggerTelegramForm config={configParams} onChange={setConfigParams} nodeId={node.id} />;
      case 'trigger_sheets':
        return <TriggerSheetsForm config={configParams} onChange={setConfigParams} credentials={credentials} />;
      case 'action_sheets':
        return <ActionSheetsForm config={configParams} onChange={setConfigParams} credentials={credentials} nodeId={node.id} />;
      case 'action_telegram':
        return <ActionTelegramForm config={configParams} onChange={setConfigParams} nodeId={node.id} />;
      case 'action_calendar':
        return <ActionCalendarForm config={configParams} onChange={setConfigParams} credentials={credentials} nodeId={node.id} />;
      case 'action_gmail':
        return <ActionGmailForm config={configParams} onChange={setConfigParams} credentials={credentials} nodeId={node.id} />;
      case 'action_agent':
        return <ActionAgentForm config={configParams} onChange={setConfigParams} credentials={credentials} nodeId={node.id} />;
      case 'action_condition':
        return <ConditionForm config={configParams} onChange={setConfigParams} nodeId={node.id} />;
      default:
        return <div className="text-center text-slate-400 py-6">Basic configuration for {node.name}</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
      />
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 h-[70vh] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-50 flex flex-col shadow-2xl"
      >
        <div className="flex-none p-4 pb-2 border-b border-slate-800 flex justify-between items-center">
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-slate-100 text-center flex-1">Configure {node.name}</h2>
          <button onClick={handleSave} className="p-2 bg-primary text-white rounded-full">
            <Check className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
