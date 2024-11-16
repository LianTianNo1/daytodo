import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  currentGroupId: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setCurrentGroupId: (groupId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
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
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  toggleComplete: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  })),
  setCurrentGroupId: (groupId) => set({ currentGroupId: groupId }),
}));
