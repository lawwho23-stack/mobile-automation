import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { useEffect, useState } from 'react';
import { getTranslation } from '../lib/i18n';

interface CredentialsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialsSheet({ isOpen, onClose }: CredentialsSheetProps) {
  const { credentials, fetchCredentials, saveCredential, removeCredential } = useFlowStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCred, setNewCred] = useState({ name: '', provider: 'openai', apiKey: '' });
  const lang = 'my';

  useEffect(() => {
    if (isOpen) fetchCredentials();
  }, [isOpen, fetchCredentials]);

  const handleSave = async () => {
    if (!newCred.name || !newCred.apiKey) return;
    await saveCredential(newCred);
    setIsAdding(false);
    setNewCred({ name: '', provider: 'openai', apiKey: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80]"
          />
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[80vh] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-[90] flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-3xl z-10">
              <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 active:scale-95 transition-transform">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-semibold text-slate-100 text-center flex-1 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {getTranslation(lang, 'configurations')}
              </h2>
              <button 
                onClick={() => setIsAdding(true)}
                className="p-2 bg-primary/20 text-primary rounded-full active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/30">
              <button 
                onClick={() => window.open('http://localhost:3001/auth/google', '_blank')}
                className="w-full bg-white text-slate-900 h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-xl active:scale-95 transition-all mb-4"
              >
                <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
                Google နှင့် ချိတ်ဆက်မည်
              </button>

              {isAdding && (
                <div className="bg-slate-800 p-4 rounded-2xl border border-primary/30 space-y-3 mb-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">အမည် (နမူနာ - My OpenAI)</label>
                    <input 
                      type="text" 
                      value={newCred.name}
                      onChange={e => setNewCred({...newCred, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none focus:border-primary transition-colors"
                      placeholder="Credential Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">API Key</label>
                    <input 
                      type="password" 
                      value={newCred.apiKey}
                      onChange={e => setNewCred({...newCred, apiKey: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none focus:border-primary transition-colors"
                      placeholder="sk-..."
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              )}

              {credentials.length === 0 && !isAdding ? (
                <div className="text-center py-10 text-slate-600">
                  <Key className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">သိမ်းဆည်းထားသော Key များ မရှိသေးပါ</p>
                </div>
              ) : (
                credentials.map((cred) => (
                  <div key={cred.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        {cred.provider === 'google' ? (
                          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                        ) : (
                          <Key className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{cred.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                          {cred.provider} {cred.apiKey ? `• ****${cred.apiKey.slice(-4)}` : '• OAuth Attached'}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeCredential(cred.id)}
                      className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
