import { motion } from 'framer-motion';
import { Mail, Calendar, Table, Send, Bot, Pencil, Trash2 } from 'lucide-react';
import type { FlowNode, NodeType } from '../store/flowStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  trigger_schedule: <Calendar className="w-5 h-5" />,
  action_sheets: <Table className="w-5 h-5 text-green-400" />,
  action_calendar: <Calendar className="w-5 h-5 text-blue-400" />,
  action_gmail: <Mail className="w-5 h-5 text-red-400" />,
  action_telegram: <Send className="w-5 h-5 text-sky-400" />,
  action_agent: <Bot className="w-5 h-5 text-purple-400" />,
};

interface FlowCardProps {
  node: FlowNode;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onEdit: (node: FlowNode) => void;
}

export function FlowCard({ node, index, isFirst, isLast, onDelete, onEdit }: FlowCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: 'easeOut' }}
      className="relative flex flex-col items-center w-full"
    >
      {/* Visual Connection Line Above */}
      {!isFirst && (
        <div className="h-6 w-0.5 bg-gradient-to-b from-slate-600 to-slate-400 my-1" />
      )}

      {/* Card Container */}
      <div 
        className="w-full glass rounded-2xl p-4 shadow-sm border-slate-700/50 hover:bg-slate-800/80 transition-colors cursor-pointer group select-none"
        onClick={() => setShowActions(!showActions)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl flex items-center justify-center",
              "bg-slate-800/80 border border-slate-700/50 shadow-inner"
            )}>
              {NODE_ICONS[node.type]}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-100">{node.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {node.type.startsWith('trigger_') ? 'Trigger' : 'Action'}
              </p>
            </div>
          </div>
          
          <div className="text-slate-500">
            <span className="text-sm font-medium bg-slate-800 px-2 py-1 rounded-md">
              {index + 1}
            </span>
          </div>
        </div>

        {/* Action Panel (Slide down) */}
        {showActions && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/50"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(node); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm active:scale-95"
            >
              <Pencil className="w-4 h-4" />
              Configure
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      {/* Down Arrow underneath if not last */}
      {!isLast && (
        <div className="absolute -bottom-7 w-3 h-3 border-r-2 border-b-2 border-slate-400 rotate-45" />
      )}
    </motion.div>
  );
}
