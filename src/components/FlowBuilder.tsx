import { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { FlowNode } from '../store/flowStore';
import { FlowCard } from './FlowCard';
import { AddNodeSheet } from './AddNodeSheet';
import { ConfigNodeSheet } from './ConfigNodeSheet';
import { MobileLayout } from './MobileLayout';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function FlowBuilder() {
  const { nodes, removeNode, addNode, updateNodeConfig, isSimulating, simulationStep, nextSimulationStep, stopSimulation } = useFlowStore();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);

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
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <AlertCircle className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-200">No nodes yet</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Tap the <span className="font-bold text-primary">+</span> button below to start building your automated flow.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-2">
            <AnimatePresence>
              {nodes.map((node, index) => {
                const isActiveStep = isSimulating && simulationStep === index;
                const isPastStep = isSimulating && simulationStep !== null && simulationStep > index;

                return (
                  <div key={node.id} className="relative w-full">
                    {/* Simulation Highlight/Status */}
                    {isSimulating && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={cn(
                          "absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-full rounded-l-md transition-all z-10",
                          isActiveStep ? "bg-primary shadow-[0_0_15px_rgba(59,130,246,0.6)]" : 
                          isPastStep ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-transparent"
                        )}
                      />
                    )}
                    
                    <FlowCard
                      node={node}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === nodes.length - 1}
                      onDelete={removeNode}
                      onEdit={(n) => setEditingNode(n)}
                    />
                  </div>
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
