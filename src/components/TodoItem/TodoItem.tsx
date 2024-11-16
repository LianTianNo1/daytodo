import React, { useState } from 'react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import { Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';
import './TodoItem.less';

interface TodoItemProps {
  task: Task;
}

export const TodoItem: React.FC<TodoItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { updateTask, deleteTask, toggleComplete } = useTaskStore();

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="edit-input"
            />
          ) : (
            <>
              <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span className="title">{task.title}</span>
            </>
          )}
        </div>
        <div className="todo-meta">
          创建于 {format(task.createdAt, 'yyyy-MM-dd HH:mm')}
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="action-btn delete"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 size={16} />
        </button>
        <button
          className={`action-btn complete ${task.completed ? 'active' : ''}`}
          onClick={() => toggleComplete(task.id)}
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  );
};
