import React, { useState } from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { PlusCircle } from 'lucide-react';
import './GroupList.less';

export const GroupList: React.FC = () => {
  const { groups, addGroup, updateGroup } = useGroupStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddGroup = () => {
    addGroup({
      name: '新分组',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
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
        {groups.map(group => (
          <div
            key={group.id}
            className="group-item"
            onDoubleClick={() => handleDoubleClick(group)}
          >
            {editingId === group.id ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyPress={e => handleKeyPress(e, group.id)}
                onBlur={() => setEditingId(null)}
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
      </div>
    </div>
  );
};
