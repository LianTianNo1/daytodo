import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag } from '../types/task';

interface TagState {
  tags: Tag[];
  selectedTags: string[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  toggleSelectedTag: (tagId: string) => void;
  clearSelectedTags: () => void;
}

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
      name: 'tag-storage',
      storage: {
        getItem: async (name) => {
          // 优先使用 Tauri 存储
          try {
            const { invoke } = await import('@tauri-apps/api');
            const data = await invoke('get_storage', { key: name });
            return data as string;
          } catch {
            // 降级到 localStorage
            return localStorage.getItem(name);
          }
        },
        setItem: async (name, value) => {
          try {
            const { invoke } = await import('@tauri-apps/api');
            await invoke('set_storage', { key: name, value });
          } catch {
            localStorage.setItem(name, value);
          }
        },
        removeItem: async (name) => {
          try {
            const { invoke } = await import('@tauri-apps/api');
            await invoke('remove_storage', { key: name });
          } catch {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);
