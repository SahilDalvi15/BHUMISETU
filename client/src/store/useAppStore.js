import { create } from 'zustand';
import { initialState } from './initialData';

const useAppStore = create((set, get) => ({
  ...initialState,

  // Demo User Management
  setActiveUser: (userId) => set((state) => {
    const user = state.users.find(u => u.id === userId);
    return user ? { activeUser: user } : state;
  }),

  // Projects
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
  })),

  // Proposals
  addProposal: (proposal) => set((state) => ({
    proposals: [...state.proposals, proposal]
  })),

  updateProposal: (proposalId, updates) => set((state) => ({
    proposals: state.proposals.map(p => p.id === proposalId ? { ...p, ...updates } : p)
  })),

  // Tasks (Workflow)
  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t)
  })),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),

  // Alerts
  resolveAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a)
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, alert]
  })),

  // Compensations
  updateCompensation: (compId, updates) => set((state) => ({
    compensations: state.compensations.map(c => c.id === compId ? { ...c, ...updates } : c)
  })),

  // R&R Families
  updateRRFamily: (familyId, updates) => set((state) => ({
    rrFamilies: state.rrFamilies.map(f => f.id === familyId ? { ...f, ...updates } : f)
  })),

  // Possessions
  updatePossession: (posId, updates) => set((state) => ({
    possessions: state.possessions.map(p => p.id === posId ? { ...p, ...updates } : p)
  })),

}));

export default useAppStore;
