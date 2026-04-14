import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, Table, Send, Bot, Pencil, Trash2, Zap, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import type { FlowNode, NodeType } from '../store/flowStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  trigger_schedule: <Calendar className="w-5 h-5 text-emerald-400" />,
  trigger_telegram: <Send className="w-5 h-5 text-sky-400" />,
  trigger_sheets: <Table className="w-5 h-5 text-green-400" />,
  action_sheets: <Table className="w-5 h-5 text-green-400" />,
  action_calendar: <Calendar className="w-5 h-5 text-blue-400" />,
  action_gmail: <Mail className="w-5 h-5 text-red-400" />,
  action_telegram: <Send className="w-5 h-5 text-sky-400" />,
  action_agent: <Bot className="w-5 h-5 text-purple-400" />,
  action_condition: <Zap className="w-5 h-5 text-orange-400" />,
};

interface FlowCardProps {
  node: FlowNode;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onEdit: (node: FlowNode) => void;
  isSimulating: boolean;
  isActiveStep: boolean;
  isPastStep: boolean;
}

export function FlowCard({ node, index, isFirst, isLast, onDelete, onEdit, isSimulating, isActiveStep, isPastStep }: FlowCardProps) {
  const [showActions, setShowActions] = useState(false);
  const reorderNodes = useFlowStore(state => state.reorderNodes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: 'easeOut' }}
      className="relative flex flex-col items-center w-full px-4"
    >
      {/* Visual Connection Line Above */}
      {!isFirst && (
        <div className={cn(
          "h-8 w-0.5 my-0.5 transition-colors duration-500",
          isPastStep ? "bg-emerald-500" : isActiveStep ? "bg-primary animate-pulse" : "bg-slate-700/50"
        )} />
      )}

      {/* Card Container */}
      <div 
        className={cn(
          "w-full rounded-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden",
          "border backdrop-blur-md relative",
          isActiveStep 
            ? "bg-primary/10 border-primary ring-1 ring-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
            : isPastStep 
              ? "bg-slate-900 border-emerald-500/50 shadow-sm"
              : "bg-slate-900/60 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 shadow-sm"
        )}
        onClick={() => setShowActions(!showActions)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl flex items-center justify-center transition-all duration-300",
              isActiveStep ? "bg-primary scale-110 shadow-lg shadow-primary/25" : "bg-slate-800"
            )}>
              {isActiveStep ? <div className="w-5 h-5 text-white animate-spin">⏳</div> : NODE_ICONS[node.type]}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-bold text-sm tracking-tight transition-colors",
                  isActiveStep ? "text-primary" : "text-slate-100"
                )}>{node.name}</h3>
                {isPastStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">
                {node.type.startsWith('trigger_') ? 'Trigger' : 'Action'} • STEP {index + 1}
              </p>
            </div>
          </div>
          
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-600 transition-transform duration-300",
            showActions ? "rotate-180" : ""
          )} />
        </div>

        {/* Action Panel */}
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-2"
            >
              <div className="flex flex-col gap-2 flex-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                  className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Configure
                </button>
                <div className="flex gap-2">
                  {!isFirst && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); reorderNodes(index, index - 1); }}
                      className="flex-1 h-9 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700/50"
                    >
                      Up
                    </button>
                  )}
                  {!isLast && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); reorderNodes(index, index + 1); }}
                      className="flex-1 h-9 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700/50"
                    >
                      Down
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                className="w-10 h-20 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-colors border border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connection Indicator Below */}
      {!isLast && (
        <div className={cn(
          "w-1.5 h-1.5 rounded-full mt-1.5 transition-colors duration-500",
          isPastStep ? "bg-emerald-500" : "bg-slate-700"
        )} />
      )}
    </motion.div>
  );
}
