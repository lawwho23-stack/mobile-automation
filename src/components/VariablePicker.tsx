import { useFlowStore } from '../store/flowStore';
import { Database, MessageSquare, Bot, Table, Calendar } from 'lucide-react';

interface VariablePickerProps {
  currentNodeId: string;
  onSelect: (variable: string) => void;
}

const VARS_BY_TYPE: Record<string, { label: string, path: string, icon: any }[]> = {
  trigger_telegram: [
    { label: 'Message Text', path: 'message.text', icon: MessageSquare },
    { label: 'Sender Name', path: 'message.from.first_name', icon: MessageSquare },
    { label: 'Chat ID', path: 'message.chat.id', icon: MessageSquare },
  ],
  action_agent: [
    { label: 'AI Result', path: 'output', icon: Bot },
  ],
  trigger_sheets: [
    { label: 'New Rows', path: 'newRows', icon: Table },
    { label: 'All Rows', path: 'allRows', icon: Table },
  ],
  trigger_schedule: [
    { label: 'Time', path: 'timestamp', icon: Calendar },
  ]
};

export function VariablePicker({ currentNodeId, onSelect }: VariablePickerProps) {
  const { nodes } = useFlowStore();
  
  // Find all nodes BEFORE the current one
  const currentIndex = nodes.findIndex(n => n.id === currentNodeId);
  if (currentIndex <= 0) return null;
  
  const precedingNodes = nodes.slice(0, currentIndex);

  return (
    <div className="mt-4 border-t border-slate-800 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Insert Variable (အရင်အဆင့်မှ အချက်အလက်ယူမည်)</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {precedingNodes.map(node => {
          const vars = VARS_BY_TYPE[node.type] || [{ label: 'Output', path: 'output', icon: Database }];
          
          return vars.map((v, idx) => (
            <button
              key={`${node.id}-${idx}`}
              onClick={() => onSelect(`{{${node.id}.${v.path}}}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-300 active:scale-95 transition-all hover:bg-slate-700 hover:border-primary/50"
            >
              <v.icon className="w-3 h-3 text-primary" />
              <span className="font-medium">{node.name} {v.label}</span>
            </button>
          ));
        })}
      </div>
    </div>
  );
}
