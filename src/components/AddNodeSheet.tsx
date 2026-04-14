import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Table, Send, Bot, Zap } from 'lucide-react';
import type { NodeType } from '../store/flowStore';
import { getTranslation } from '../lib/i18n';

interface AddNodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (type: NodeType, name: string) => void;
}

const AVAILABLE_NODES = [
  // Triggers
  { type: 'trigger_schedule', nameKey: 'trigger_schedule', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { type: 'trigger_telegram', nameKey: 'trigger_telegram', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { type: 'trigger_sheets', nameKey: 'trigger_sheets', icon: Table, color: 'text-green-400', bg: 'bg-green-400/10' },
  
  // Actions
  { type: 'action_sheets', nameKey: 'action_sheets', icon: Table, color: 'text-green-400', bg: 'bg-green-400/10' },
  { type: 'action_telegram', nameKey: 'action_telegram', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { type: 'action_agent', nameKey: 'action_agent', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
   { type: 'action_calendar', nameKey: 'action_calendar', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { type: 'action_gmail', nameKey: 'action_gmail', icon: Mail, color: 'text-red-400', bg: 'bg-red-400/10' },
  { type: 'action_condition', nameKey: 'action_condition', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10' },
] as const;

export function AddNodeSheet({ isOpen, onClose, onSelectNode }: AddNodeSheetProps) {
  // Hardcoded to 'my' for now as per Myanmar target users
  const lang = 'my';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
          
          {/* Bottom Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] h-[600px] bg-slate-900 border-t border-slate-700/50 rounded-t-3xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex-none p-4 pb-2 text-center relative border-b border-slate-800">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-12 h-1.5 bg-slate-700 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-100 mt-2">{getTranslation(lang, 'add_node')}</h2>
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 bg-slate-800 rounded-full text-slate-400 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe">
              {AVAILABLE_NODES.map((node) => (
                <button
                  key={node.type}
                  onClick={() => onSelectNode(node.type as NodeType, getTranslation(lang, node.nameKey as any))}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 active:bg-slate-700 transition-colors text-left"
                >
                  <div className={`p-3 rounded-xl ${node.bg}`}>
                    <node.icon className={`w-6 h-6 ${node.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">{getTranslation(lang, node.nameKey as any)}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {node.type.startsWith('trigger') ? getTranslation(lang, 'start_flow') : getTranslation(lang, 'perform_action')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
