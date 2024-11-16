import { create } from 'zustand';
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
}

export const useTaskStore = create<TaskState>((set) => ({
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
}));
