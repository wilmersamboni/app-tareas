import { create } from 'zustand';
import { TaskStatus } from '../types';
import { syncTasks, toggleTaskCompleted, attachPhotoToTask } from '../services/sync';

interface TaskStore {
  filter: TaskStatus;
  isSyncing: boolean;
  syncError: string | null;
  optimisticToggle: ((taskId: string, completed: boolean) => void) | null;
  setOptimisticToggle: (fn: (taskId: string, completed: boolean) => void) => void;
  setFilter: (filter: TaskStatus) => void;
  sync: () => Promise<void>;
  toggleTask: (taskId: string, currentCompleted: boolean) => Promise<void>;
  attachPhoto: (taskId: string, uri: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  filter: 'all',
  isSyncing: false,
  syncError: null,
  optimisticToggle: null,

  setFilter: (filter) => set({ filter }),

  setOptimisticToggle: (fn) => set({ optimisticToggle: fn }),

  sync: async () => {
    set({ isSyncing: true, syncError: null });
    try {
      await syncTasks();
    } catch (error) {
      set({ syncError: error instanceof Error ? error.message : 'Error de sincronizacion' });
    } finally {
      set({ isSyncing: false });
    }
  },

toggleTask: async (taskId: string, currentCompleted: boolean) => {
  try {
    get().optimisticToggle?.(taskId, !currentCompleted);
    await toggleTaskCompleted(taskId);
  } catch (e) {
    get().optimisticToggle?.(taskId, currentCompleted);
    console.error('toggleTask error:', e);
  }
},

  attachPhoto: async (taskId, uri) => {
    try { await attachPhotoToTask(taskId, uri); }
    catch (e) { console.error('attachPhoto error:', e); }
  },
}));