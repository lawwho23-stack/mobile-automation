import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { FlowNode } from '../store/flowStore';
import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';

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

function TriggerTelegramForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
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
    </div>
  );
}

function ActionSheetsForm({ config, onChange, credentials }: { config: any, onChange: (c: any) => void, credentials: any[] }) {
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
    </div>
  );
}

function ActionAgentForm({ config, onChange, credentials }: { config: any, onChange: (c: any) => void, credentials: any[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">သိမ်းထားသော Key (Saved Key)</label>
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
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">AI ကိုခိုင်းစေမည့်အချက်များ (Prompt)</label>
        <textarea 
          value={config.prompt || ''}
          onChange={(e) => onChange({...config, prompt: e.target.value})}
          placeholder="ဘာလုပ်ပေးရမလဲ..."
          rows={4}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
        />
      </div>
    </div>
  );
}

function ConditionForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
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

      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
        <p className="text-xs text-orange-400 leading-relaxed">
          ℹ️ ဤသတ်မှတ်ချက်နှင့် မကိုက်ညီပါက နောက်ထပ်လုပ်ဆောင်ချက်များကို ဆက်လက်လုပ်ဆောင်တော့မည် မဟုတ်ပါ။
        </p>
      </div>
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
        return <TriggerTelegramForm config={configParams} onChange={setConfigParams} />;
      case 'action_sheets':
        return <ActionSheetsForm config={configParams} onChange={setConfigParams} credentials={credentials} />;
      case 'action_agent':
        return <ActionAgentForm config={configParams} onChange={setConfigParams} credentials={credentials} />;
      case 'action_condition':
        return <ConditionForm config={configParams} onChange={setConfigParams} />;
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
