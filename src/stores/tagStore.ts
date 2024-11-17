import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../services/storage';
import { Tag } from '../types/tag';

interface TagState {
  tags: Tag[];
  selectedTags: string[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  toggleSelectedTag: (tagId: string) => void;
  clearSelectedTags: () => void;
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

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: [],
      selectedTags: [],
      addTag: (tag) => set((state) => ({
        tags: [...state.tags, {
          ...tag,
          id: crypto.randomUUID(),
        }]
      })),
      updateTag: (id, updatedTag) => set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === id ? { ...tag, ...updatedTag } : tag
        )
      })),
      deleteTag: (id) => set((state) => ({
        tags: state.tags.filter(tag => tag.id !== id),
        selectedTags: state.selectedTags.filter(tagId => tagId !== id)
      })),
      toggleSelectedTag: (tagId) => set((state) => ({
        selectedTags: state.selectedTags.includes(tagId)
          ? state.selectedTags.filter(id => id !== tagId)
          : [...state.selectedTags, tagId]
      })),
      clearSelectedTags: () => set({ selectedTags: [] })
    }),
    {
      name: 'tags-storage',
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
