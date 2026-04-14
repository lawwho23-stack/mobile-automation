import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { FlowNode } from '../store/flowStore';
import { FlowCard } from './FlowCard';
import { AddNodeSheet } from './AddNodeSheet';
import { ConfigNodeSheet } from './ConfigNodeSheet';
import { MobileLayout } from './MobileLayout';
import { Zap, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { getTranslation } from '../lib/i18n';

export function FlowBuilder() {
  const { nodes, removeNode, addNode, updateNodeConfig, isSimulating, simulationStep, nextSimulationStep, stopSimulation } = useFlowStore();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);

  // Hardcoded to 'my' for now
  const lang = 'my';

  // Auto-runner for simulation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSimulating && simulationStep !== null) {
      if (simulationStep < nodes.length - 1) {
        timer = setTimeout(() => {
          nextSimulationStep();
        }, 1500); // Wait 1.5s per step
      } else {
        // End of flow
        timer = setTimeout(() => {
          stopSimulation();
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simulationStep, nodes.length, nextSimulationStep, stopSimulation]);

  const handleAddNode = (type: FlowNode["type"], name: string) => {
    addNode({ type, name, config: {} });
    setIsAddSheetOpen(false);
  };

  return (
    <MobileLayout onAddClick={() => setIsAddSheetOpen(true)}>
      <div className="flex flex-col items-center justify-start min-h-full py-4 pb-12">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 bg-slate-800/80 border border-slate-700/50 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                <Zap className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center rotate-12">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white tracking-tight">
              {getTranslation(lang, 'no_nodes')}
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-[240px]">
              {getTranslation(lang, 'tap_plus')}
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-3 text-slate-500"
            >
              <div className="h-px w-8 bg-slate-800" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Start Building</span>
              <div className="h-px w-8 bg-slate-800" />
            </motion.div>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-2">
            <AnimatePresence>
              {nodes.map((node, index) => {
                const isActiveStep = isSimulating && simulationStep === index;
                const isPastStep = isSimulating && simulationStep !== null && simulationStep > index;

                return (
                  <FlowCard
                    key={node.id}
                    node={node}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === nodes.length - 1}
                    onDelete={removeNode}
                    onEdit={(n) => setEditingNode(n)}
                    isSimulating={isSimulating}
                    isActiveStep={isActiveStep}
                    isPastStep={isPastStep}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AddNodeSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onSelectNode={handleAddNode}
      />

      <ConfigNodeSheet
        node={editingNode}
        onClose={() => setEditingNode(null)}
        onSave={updateNodeConfig}
      />
    </MobileLayout>
  );
}
