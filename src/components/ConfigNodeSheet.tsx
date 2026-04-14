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

  return (
    <AnimatePresence>
      {node && (
        <>
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
              {(() => {
                switch (node.type) {
                  case 'trigger_schedule':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">သတ်မှတ်ချက် (Cron Expression)</label>
                          <input 
                            type="text" 
                            value={configParams.cron || '0 9 * * *'}
                            onChange={(e) => setConfigParams({...configParams, cron: e.target.value})}
                            placeholder="0 9 * * *"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <p className="text-xs text-slate-500 mt-1">ဥပမာ- '0 9 * * *' သည် နေ့စဉ် မနက် ၉ နာရီတွင် အလုပ်လုပ်ပါမည်။</p>
                        </div>
                      </div>
                    );
                  case 'trigger_telegram':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Bot Token</label>
                          <input 
                            type="text" 
                            value={configParams.token || ''}
                            onChange={(e) => setConfigParams({...configParams, token: e.target.value})}
                            placeholder="123456:ABC-DEF..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">စတင်စေမည့် စာသား (Trigger Command)</label>
                          <input 
                            type="text" 
                            value={configParams.command || '/start'}
                            onChange={(e) => setConfigParams({...configParams, command: e.target.value})}
                            placeholder="/start"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">အော်တို ပြန်စာ (Auto Reply Message)</label>
                          <input 
                            type="text" 
                            value={configParams.autoReply || ''}
                            onChange={(e) => setConfigParams({...configParams, autoReply: e.target.value})}
                            placeholder="လုပ်ဆောင်ချက် စတင်ပါပြီ..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    );
                  case 'trigger_sheets':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">Spreadsheet ID</label>
                          <input 
                            type="text" 
                            value={configParams.sheetId || ''}
                            onChange={(e) => setConfigParams({...configParams, sheetId: e.target.value})}
                            placeholder="1BxiMVs0XRY..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">စစ်ဆေးမည့် အချိန်ခြားနားချက် (Interval)</label>
                          <select 
                            value={configParams.interval || '5'}
                            onChange={(e) => setConfigParams({...configParams, interval: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="1">၁ မိနစ်တိုင်း</option>
                            <option value="5">၅ မိနစ်တိုင်း</option>
                            <option value="15">၁၅ မိနစ်တိုင်း</option>
                            <option value="60">၁ နာရီတိုင်း</option>
                          </select>
                        </div>
                      </div>
                    );
                  case 'action_sheets':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">အသုံးပြုမည့် Google Account</label>
                          <select 
                            value={configParams.credentialId || ''}
                            onChange={(e) => setConfigParams({...configParams, credentialId: e.target.value})}
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
                            value={configParams.sheetId || ''}
                            onChange={(e) => setConfigParams({...configParams, sheetId: e.target.value})}
                            placeholder="1BxiMVs0XRY..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">ထည့်သွင်းမည့် အချက်အလက်များ (Values)</label>
                          <input 
                            type="text" 
                            value={configParams.values || ''}
                            onChange={(e) => setConfigParams({...configParams, values: e.target.value})}
                            placeholder="Name, Phone, Email..."
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <p className="text-[10px] text-slate-500 ml-1 italic">{`, (ကော်မာ) ဖြင့် ခြား၍ ရေးပေးပါ (ဥပမာ- {{telegram.text}}, {{agent.output}})`}</p>
                        </div>
                      </div>
                    );
                  case 'action_telegram':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">ပို့မည့်သူ ID (Chat ID)</label>
                          <input 
                            type="text" 
                            value={configParams.chatId || ''}
                            onChange={(e) => setConfigParams({...configParams, chatId: e.target.value})}
                            placeholder="123456789"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">ပို့မည့်စာသား (Message)</label>
                          <textarea 
                            value={configParams.message || ''}
                            onChange={(e) => setConfigParams({...configParams, message: e.target.value})}
                            placeholder="မင်္ဂလာပါ..."
                            rows={3}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    );
                  case 'action_agent':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">သိမ်းထားသော Key (Saved Key)</label>
                          <select 
                            value={configParams.credentialId || ''}
                            onChange={(e) => setConfigParams({...configParams, credentialId: e.target.value, apiKey: ''})}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="">အသစ်ထည့်မည် (Manual)</option>
                            {credentials.map((c: any) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        {!configParams.credentialId && (
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">API Key</label>
                            <input 
                              type="password" 
                              value={configParams.apiKey || ''}
                              onChange={(e) => setConfigParams({...configParams, apiKey: e.target.value})}
                              placeholder="sk-..."
                              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">AI ကိုခိုင်းစေမည့်အချက်များ (Prompt)</label>
                          <textarea 
                            value={configParams.prompt || ''}
                            onChange={(e) => setConfigParams({...configParams, prompt: e.target.value})}
                            placeholder="ဘာလုပ်ပေးရမလဲ... (ဥပမာ- {{telegram.text}} ကို အကျဉ်းချုပ်ပေးပါ)"
                            rows={4}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                          />
                          <p className="text-[10px] text-slate-500 ml-1 italic">{`{{node_id.property}} ကို အသုံးပြုနိုင်ပါသည်။`}</p>
                        </div>
                      </div>
                    );
                  case 'action_condition':
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">စစ်ဆေးမည့် အချက် (Value to Check)</label>
                          <input 
                            type="text" 
                            value={configParams.input || ''}
                            onChange={(e) => setConfigParams({...configParams, input: e.target.value})}
                            placeholder="ဥပမာ- {{agent.output}}"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <p className="text-[10px] text-slate-500 ml-1 italic">{`{{node_id.property}} ကို အသုံးပြုနိုင်ပါသည်။`}</p>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-300">သတ်မှတ်ချက် (Operator)</label>
                          <select 
                            value={configParams.operator || 'contains'}
                            onChange={(e) => setConfigParams({...configParams, operator: e.target.value})}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="contains">ပါဝင်လျှင် (Contains)</option>
                            <option value="equals">တူညီလျှင် (Equals)</option>
                            <option value="not_equals">မတူညီလျှင် (Not Equals)</option>
                            <option value="exists">ရှိနေလျှင် (Is not empty)</option>
                          </select>
                        </div>

                        {configParams.operator !== 'exists' && (
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">တန်ဖိုး (Comparison Value)</label>
                            <input 
                              type="text" 
                              value={configParams.value || ''}
                              onChange={(e) => setConfigParams({...configParams, value: e.target.value})}
                              placeholder="ဥပမာ- Yes"
                              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        )}

                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                          <p className="text-xs text-orange-400 leading-relaxed">
                            ℹ️ ဤသတ်မှတ်ချက်နှင့် မကိုက်ညီပါက နောက်ထပ်လုပ်ဆောင်ချက်များကို ဆက်လက်လုပ်ဆောင်တော့မည် မဟုတ်ပါ။
                          </p>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <div className="text-center text-slate-400 py-6">
                        Basic configuration for {node.name}
                      </div>
                    );
                }
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
