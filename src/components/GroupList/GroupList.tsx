import React, { useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { useTaskStore } from '../../stores/taskStore';
import { PlusCircle, Trash2 } from 'lucide-react';
import './GroupList.less';

export const GroupList: React.FC = () => {
  const { groups, addGroup, updateGroup } = useGroupStore();
  const setCurrentGroupId = useTaskStore(state => state.setCurrentGroupId);
  const currentGroupId = useTaskStore(state => state.currentGroupId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const trashedTasks = useTaskStore(state => state.trashedTasks);

  const handleAddGroup = () => {
    const newGroup = {
      name: '新分组',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    addGroup(newGroup);
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

  const handleGroupClick = (groupId: string) => {
    setCurrentGroupId(groupId);
  };

  return (
    <div className="group-list">
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

        {groups.map(group => (
          <div
            key={group.id}
            className={`group-item ${currentGroupId === group.id ? 'active' : ''}`}
            onClick={() => handleGroupClick(group.id)}
            onDoubleClick={() => handleDoubleClick(group)}
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
              </>
            )}
          </div>
        ))}

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
      </div>
    </div>
  );
};
