import { create } from 'zustand';

export type NodeType = 'trigger_schedule' | 'action_sheets' | 'action_calendar' | 'action_gmail' | 'action_telegram' | 'action_agent';

export interface Credential {
  id: string;
  name: string;
  provider: string; // 'openai', 'anthropic', 'gemini', 'custom'
  apiKey: string;
  baseUrl?: string;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
}

interface FlowState {
  nodes: FlowNode[];
  credentials: Credential[];
  isSimulating: boolean;
  simulationStep: number | null;
  addNode: (node: Omit<FlowNode, 'id'>) => void;
  removeNode: (id: string) => void;
  updateNodeConfig: (id: string, config: Record<string, any>) => void;
  reorderNodes: (startIndex: number, endIndex: number) => void;
  addCredential: (cred: Omit<Credential, 'id'>) => void;
  removeCredential: (id: string) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  nextSimulationStep: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  credentials: [],
  isSimulating: false,
  simulationStep: null,
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, { ...node, id: Math.random().toString(36).substring(2, 9) }]
  })),
  
  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id)
  })),
  
  updateNodeConfig: (id, config) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, config: { ...n.config, ...config } } : n)
  })),
  
  reorderNodes: (startIndex, endIndex) => set((state) => {
    const newNodes = Array.from(state.nodes);
    const [removed] = newNodes.splice(startIndex, 1);
    newNodes.splice(endIndex, 0, removed);
    return { nodes: newNodes };
  }),
  
  addCredential: (cred) => set((state) => ({
    credentials: [...state.credentials, { ...cred, id: Math.random().toString(36).substring(2, 9) }]
  })),
  
  removeCredential: (id) => set((state) => ({
    credentials: state.credentials.filter(c => c.id !== id)
  })),
  
  startSimulation: () => set({ isSimulating: true, simulationStep: 0 }),
  stopSimulation: () => set({ isSimulating: false, simulationStep: null }),
  nextSimulationStep: () => set((state) => ({
    simulationStep: state.simulationStep !== null && state.simulationStep < state.nodes.length - 1 
      ? state.simulationStep + 1 
      : null,
    isSimulating: state.simulationStep !== null && state.simulationStep < state.nodes.length - 1
  })),
}));
