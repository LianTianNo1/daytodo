import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../services/storage';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  trashedTasks: Task[];
  currentGroupId: string;
  filters: {
    tags: string[];
    dateRange: {
      start?: string;
      end?: string;
    };
    priorities: ('P0' | 'P1' | 'P2' | 'P3' | 'P4')[];
  };
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  emptyTrash: () => void;
  toggleComplete: (id: string) => void;
  setCurrentGroupId: (groupId: string) => void;
  reorderTasks: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => void;
  setTagFilter: (tags: string[]) => void;
  setDateRangeFilter: (start?: string, end?: string) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];
  setPriorityFilter: (priorities: ('P0' | 'P1' | 'P2' | 'P3' | 'P4')[]) => void;
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
    (set, get) => ({
      tasks: [],
      trashedTasks: [],
      currentGroupId: '',
      filters: {
        tags: [],
        dateRange: {},
        priorities: [],
      },
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? {
                ...task,
                ...updatedTask,
                updatedAt: new Date().toISOString()
              }
            : task
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
      setTagFilter: (tags: string[]) =>
        set(state => ({
          filters: { ...state.filters, tags }
        })),
      setDateRangeFilter: (start?: string, end?: string) =>
        set(state => ({
          filters: {
            ...state.filters,
            dateRange: { start, end }
          }
        })),
      clearFilters: () =>
        set(state => ({
          filters: {
            tags: [],
            dateRange: {},
            priorities: [],
          }
        })),
      getFilteredTasks: () => {
        const state = get();
        let filteredTasks = state.tasks;

        // 分组过滤
        if (state.currentGroupId) {
          if (state.currentGroupId === 'trash') {
            return state.trashedTasks;
          }
          filteredTasks = filteredTasks.filter(
            task => task.groupId === state.currentGroupId
          );
        }

        // 标签过滤
        if (state.filters.tags.length > 0) {
          filteredTasks = filteredTasks.filter(task =>
            state.filters.tags.every(tagId => task.tags.includes(tagId))
          );
        }

        // 优先级过滤
        if (state.filters.priorities?.length > 0) {
          filteredTasks = filteredTasks.filter(task =>
            state.filters.priorities.includes(task.priority)
          );
        }

        // 日期范围过滤
        const { start, end } = state.filters.dateRange;
        if (start || end) {
          filteredTasks = filteredTasks.filter(task => {
            const taskStart = task.startDate ? new Date(task.startDate) : null;
            const taskDue = task.dueDate ? new Date(task.dueDate) : null;

            if (start && taskDue) {
              const startDate = new Date(start);
              if (taskDue < startDate) return false;
            }

            if (end && taskStart) {
              const endDate = new Date(end);
              if (taskStart > endDate) return false;
            }

            return true;
          });
        }

        return filteredTasks;
      },
      setPriorityFilter: (priorities) =>
        set(state => ({
          filters: { ...state.filters, priorities }
        })),
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
