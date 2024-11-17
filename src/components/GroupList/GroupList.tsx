import React, { useState } from 'react';
import { PlusCircle, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { useGroupStore } from '../../stores/groupStore';
import { useTaskStore } from '../../stores/taskStore';
import { TagManager } from '../TagManager/TagManager';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import './GroupList.less';

export const GroupList: React.FC = () => {
  const { groups, addGroup, updateGroup, deleteGroup } = useGroupStore();
  const { currentGroupId, setCurrentGroupId, trashedTasks, getTasksByGroupId } = useTaskStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleAddGroup = () => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: '新分组',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    addGroup(newGroup);
  };

  const handleGroupClick = (groupId: string) => {
    setCurrentGroupId(groupId);
  };

  const handleDoubleClick = (group: { id: string; name: string }) => {
    setEditingId(group.id);
    setEditName(group.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent, groupId: string) => {
    if (e.key === 'Enter' && editName.trim()) {
      updateGroup(groupId, { name: editName.trim() });
      setEditingId(null);
    }
  };

  const handleBlur = (groupId: string) => {
    if (editName.trim()) {
      updateGroup(groupId, { name: editName.trim() });
    }
    setEditingId(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    const tasksInGroup = getTasksByGroupId(groupId);
    if (tasksInGroup.length > 0) {
      setShowConfirmDelete(groupId);
    } else {
      deleteGroup(groupId);
      if (currentGroupId === groupId) {
        setCurrentGroupId('');
      }
    }
  };

  return (
    <div className="group-list">
      <TagManager />
      <div className="group-list-header">
        <span className="title">分组列表</span>
        <button onClick={handleAddGroup} className="add-group-btn">
          <PlusCircle className="icon" />
          <span>添加分组</span>
        </button>
      </div>

      <div className="group-items">
        <div
          className={`group-item ${!currentGroupId ? 'active' : ''}`}
          onClick={() => handleGroupClick('')}
        >
          <div className="group-color all" />
          <span className="group-name">全部任务</span>
        </div>
        <div
          className={`group-item trash ${currentGroupId === 'trash' ? 'active' : ''}`}
          onClick={() => handleGroupClick('trash')}
        >
          <div className="group-color trash">
            <Trash2 size={12} />
          </div>
          <span className="group-name">垃圾桶</span>
          {trashedTasks.length > 0 && (
            <span className="trash-count">{trashedTasks.length}</span>
          )}
        </div>

        {groups.map(group => (
          <div
            key={group.id}
            className={`group-item ${currentGroupId === group.id ? 'active' : ''}`}
            onClick={() => handleGroupClick(group.id)}
          >
            {editingId === group.id ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyPress={e => handleKeyPress(e, group.id)}
                onBlur={() => handleBlur(group.id)}
                autoFocus
                className="edit-input"
              />
            ) : (
              <>
                <div
                  className="group-color"
                  style={{ backgroundColor: group.color }}
                />
                <span className="group-name">{group.name}</span>
                <Dropdown.Root>
                  <Dropdown.Trigger asChild>
                    <button className="group-actions-trigger" onClick={e => e.stopPropagation()}>
                      <MoreVertical size={14} />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Portal>
                    <Dropdown.Content className="group-actions-content" sideOffset={5}>
                      <Dropdown.Item className="group-action-item" onSelect={() => handleDoubleClick(group)}>
                        <Edit2 size={14} />
                        重命名
                      </Dropdown.Item>
                      <Dropdown.Item className="group-action-item delete" onSelect={() => handleDeleteGroup(group.id)}>
                        <Trash2 size={14} />
                        删除分组
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown.Portal>
                </Dropdown.Root>
              </>
            )}
          </div>
        ))}
      </div>

      {showConfirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>确认删除分组？</h3>
            <p>此分组中还有未完成的任务，删除分组后，这些任务将被移动到默认分组。</p>
            <div className="dialog-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmDelete(null)}
              >
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  deleteGroup(showConfirmDelete);
                  if (currentGroupId === showConfirmDelete) {
                    setCurrentGroupId('');
                  }
                  setShowConfirmDelete(null);
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
