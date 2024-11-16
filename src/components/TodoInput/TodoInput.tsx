import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import './TodoInput.less';

export const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('P2');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const addTask = useTaskStore(state => state.addTask);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      addTask({
        title: title.trim(),
        priority: priority as 'P0' | 'P1' | 'P2' | 'P3' | 'P4',
        completed: false,
        groupId: '',
      });
      setTitle('');
    }
  };

  const priorities = ['P0', 'P1', 'P2', 'P3', 'P4'];

  return (
    <div className="todo-input-container">
      <div className="priority-selector" onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}>
        <span className={`priority-tag ${priority.toLowerCase()}`}>{priority}</span>
        <ChevronDown size={16} />
        {showPriorityDropdown && (
          <div className="priority-dropdown">
            {priorities.map(p => (
              <div
                key={p}
                className={`priority-option ${p.toLowerCase()}`}
                onClick={() => {
                  setPriority(p);
                  setShowPriorityDropdown(false);
                }}
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="添加新任务，按回车保存"
        className="todo-input"
      />
    </div>
  );
};
