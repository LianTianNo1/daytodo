import { create } from 'zustand';
import { Group } from '../types/task';

interface GroupState {
  groups: Group[];
  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
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
}));
