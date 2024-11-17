import React, { useState } from 'react';
import { useTagStore } from '../../stores/tagStore';
import { Tag, Plus, X, Edit2, Settings } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import './TagManager.less';

export const TagManager: React.FC = () => {
  const { tags, addTag, deleteTag, updateTag, selectedTags, toggleSelectedTag } = useTagStore();
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    addTag({
      name: newTagName.trim(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    setNewTagName('');
  };

  const openEditDialog = (tag: { id: string; name: string; color: string }) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleEditSubmit = () => {
    if (editingTag && editName.trim()) {
      updateTag(editingTag.id, {
        name: editName.trim(),
        color: editColor
      });
      setEditingTag(null);
    }
  };

  return (
    <div className="tag-manager">
      <div className="tag-header">
        <span className="title">标签管理</span>
      </div>

      <div className="tag-input">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="添加新标签"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <button
          onClick={handleAddTag}
          className="add-btn"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="tag-list">
        {tags.map(tag => (
          <div
            key={tag.id}
            // className={`tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
            className={`tag`}
            style={{ backgroundColor: `${tag.color}10`, color: tag.color }}
          >
            <div className="tag-content" onClick={() => toggleSelectedTag(tag.id)}>
              <Tag size={12} />
              <span>{tag.name}</span>
            </div>

            <div className="tag-actions">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button
                    className="edit-btn"
                    onClick={() => openEditDialog(tag)}
                  >
                    <Settings size={12} />
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay" />
                  <Dialog.Content className="dialog-content">
                    <Dialog.Title className="dialog-title">编辑标签</Dialog.Title>
                    <div className="dialog-body">
                      <div className="form-item">
                        <label>标签名称</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="输入标签名称"
                        />
                      </div>
                      <div className="form-item">
                        <label>标签颜色</label>
                        <div className="color-picker">
                          <input
                            type="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                          />
                          <span className="color-preview" style={{ backgroundColor: editColor }} />
                        </div>
                      </div>
                    </div>
                    <div className="dialog-footer">
                      <Dialog.Close asChild>
                        <button className="btn-secondary">取消</button>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <button className="btn-primary" onClick={handleEditSubmit}>
                          确定
                        </button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTag(tag.id);
                }}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
