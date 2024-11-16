import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updatedTask, updatedAt: new Date() } : task
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  toggleComplete: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
    )
  })),
}));
