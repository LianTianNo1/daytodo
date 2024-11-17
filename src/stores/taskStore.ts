import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../services/storage';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  trashedTasks: Task[];
  currentGroupId: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  emptyTrash: () => void;
  toggleComplete: (id: string) => void;
  setCurrentGroupId: (groupId: string) => void;
  reorderTasks: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => void;
}

// 修改自定义持久化配置
const customStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await storage.get(name);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await storage.set(name, value);
    } catch (error) {
      console.error('Error setting item:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await storage.remove(name);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      trashedTasks: [],
      currentGroupId: '',
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }]
      })),
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      })),
      deleteTask: (id) => set((state) => {
        const taskToDelete = state.tasks.find(task => task.id === id);
        if (!taskToDelete) return state;

        return {
          tasks: state.tasks.filter(task => task.id !== id),
          trashedTasks: [...state.trashedTasks, taskToDelete]
        };
      }),
      restoreTask: (id) => set((state) => {
        const taskToRestore = state.trashedTasks.find(task => task.id === id);
        if (!taskToRestore) return state;

        return {
          trashedTasks: state.trashedTasks.filter(task => task.id !== id),
          tasks: [...state.tasks, taskToRestore]
        };
      }),
      permanentlyDeleteTask: (id) => set((state) => ({
        trashedTasks: state.trashedTasks.filter(task => task.id !== id)
      })),
      emptyTrash: () => set((state) => ({ trashedTasks: [] })),
      toggleComplete: (id) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      })),
      setCurrentGroupId: (groupId) => set({ currentGroupId: groupId }),
      reorderTasks: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) =>
        set((state) => {
          const allTasks = [...state.tasks];

          const sourceGroupTasks = allTasks.filter(task => task.groupId === sourceGroupId);
          const targetGroupTasks = allTasks.filter(task => task.groupId === targetGroupId);

          const [taskToMove] = sourceGroupTasks.splice(dragIndex, 1);

          if (sourceGroupId !== targetGroupId) {
            taskToMove.groupId = targetGroupId;
            targetGroupTasks.splice(hoverIndex, 0, taskToMove);
          } else {
            sourceGroupTasks.splice(hoverIndex, 0, taskToMove);
          }

          const otherTasks = allTasks.filter(task =>
            task.groupId !== sourceGroupId && task.groupId !== targetGroupId
          );

          const updatedTasks = [
            ...otherTasks,
            ...(sourceGroupId === targetGroupId ? sourceGroupTasks : []),
            ...(sourceGroupId !== targetGroupId ? [...sourceGroupTasks, ...targetGroupTasks] : [])
          ];

          return { tasks: updatedTasks };
        }),
    }),
    {
      name: 'tasks-storage',
      storage: customStorage,
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => {
        if (!str) return {};
        try {
          return JSON.parse(str);
        } catch (e) {
          console.error('Error parsing state:', e);
          return {};
        }
      },
    }
  )
);
