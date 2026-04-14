import { create } from 'zustand';

export type NodeType = 'trigger_schedule' | 'trigger_telegram' | 'trigger_sheets' | 'action_sheets' | 'action_calendar' | 'action_gmail' | 'action_telegram' | 'action_agent' | 'action_condition';

export interface Credential {
  id: string;
  name: string;
  provider: string; 
  apiKey: string;
  baseUrl?: string;
  meta?: any;
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
  actualLogs: any[];
  savedFlows: any[];
  activeFlowId: string | null;
  
  addNode: (node: Omit<FlowNode, 'id'>) => void;
  removeNode: (id: string) => void;
  updateNodeConfig: (id: string, config: Record<string, any>) => void;
  reorderNodes: (startIndex: number, endIndex: number) => void;
  
  startSimulation: () => void;
  stopSimulation: () => void;
  nextSimulationStep: () => void;
  
  fetchLogs: () => Promise<void>;
  fetchCredentials: () => Promise<void>;
  saveCredential: (cred: Omit<Credential, 'id'>) => Promise<void>;
  removeCredential: (id: string) => Promise<void>;
  
  fetchFlows: () => Promise<void>;
  saveFlow: (name?: string) => Promise<void>;
  deleteFlow: (id: string) => Promise<void>;
  toggleFlowEnabled: (id: string) => Promise<void>;
  loadFlow: (id: string) => void;
  clearFlow: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  credentials: [],
  isSimulating: false,
  simulationStep: null,
  actualLogs: [],
  savedFlows: [],
  activeFlowId: null,
  
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
  
  startSimulation: () => set({ isSimulating: true, simulationStep: 0 }),
  stopSimulation: () => set({ isSimulating: false, simulationStep: null }),
  nextSimulationStep: () => set((state) => ({
    simulationStep: state.simulationStep !== null && state.simulationStep < state.nodes.length - 1 
      ? state.simulationStep + 1 
      : null,
    isSimulating: state.simulationStep !== null && state.simulationStep < state.nodes.length - 1
  })),

  fetchFlows: async () => {
    try {
      const res = await fetch(`${API_BASE}/flows`);
      const data = await res.json();
      set({ savedFlows: data });
    } catch (err) {
      console.error('Failed to fetch flows', err);
    }
  },

  loadFlow: (id) => {
    const flow = get().savedFlows.find(f => f.id === id);
    if (flow) {
      set({ nodes: flow.nodes, activeFlowId: id });
    }
  },

  clearFlow: () => set({ nodes: [], activeFlowId: null }),

  saveFlow: async (name) => {
    const { nodes, activeFlowId } = get();
    if (nodes.length === 0) return;
    
    const payload = {
      id: activeFlowId,
      name: name || (activeFlowId ? undefined : 'Flow ' + new Date().toLocaleTimeString()),
      nodes,
      enabled: true
    };

    const res = await fetch(`${API_BASE}/flows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const savedFlow = await res.json();
    set({ activeFlowId: savedFlow.id });
    get().fetchFlows();
  },

  deleteFlow: async (id) => {
    try {
      await fetch(`${API_BASE}/flows/${id}`, { method: 'DELETE' });
      if (get().activeFlowId === id) get().clearFlow();
      get().fetchFlows();
    } catch (err) {
      console.error('Failed to delete flow', err);
    }
  },

  toggleFlowEnabled: async (id) => {
    try {
      await fetch(`${API_BASE}/flows/${id}/toggle`, { method: 'POST' });
      get().fetchFlows();
    } catch (err) {
      console.error('Failed to toggle flow', err);
    }
  },

  fetchLogs: async () => {
    try {
      const res = await fetch(`${API_BASE}/logs`);
      const data = await res.json();
      set({ actualLogs: data });
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  },

  fetchCredentials: async () => {
    try {
      const res = await fetch(`${API_BASE}/credentials`);
      const data = await res.json();
      set({ credentials: data });
    } catch (err) {
      console.error('Failed to fetch credentials', err);
    }
  },

  saveCredential: async (cred) => {
    try {
      await fetch(`${API_BASE}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      get().fetchCredentials();
    } catch (err) {
      console.error('Failed to save credential', err);
    }
  },

  removeCredential: async (id) => {
    try {
      await fetch(`${API_BASE}/credentials/${id}`, { method: 'DELETE' });
      get().fetchCredentials();
    } catch (err) {
      console.error('Failed to delete credential', err);
    }
  }
}));
