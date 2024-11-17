import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../services/storage';
import { Group } from '../types/group';

interface GroupState {
  groups: Group[];
  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
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

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      groups: [],
      addGroup: (group) => set((state: GroupState) => ({
        groups: [...state.groups, {
          ...group,
          id: crypto.randomUUID(),
        }]
      })),
      updateGroup: (id, updatedGroup) => set((state: GroupState) => ({
        groups: state.groups.map(group =>
          group.id === id ? { ...group, ...updatedGroup } : group
        )
      })),
      deleteGroup: (id) => set((state: GroupState) => ({
        groups: state.groups.filter(group => group.id !== id)
      })),
    }),
    {
      name: 'groups-storage',
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
