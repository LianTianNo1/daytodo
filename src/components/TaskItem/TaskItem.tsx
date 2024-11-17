import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { Check, Trash2, Edit2 } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { PriorityDropdown } from '../PriorityDropdown/PriorityDropdown';
import { Task } from '../../types/task';
import './TaskItem.less';

interface TaskItemProps {
  task: Task;
  isInTrash?: boolean;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isInTrash, index, moveTask }) => {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { updateTask, deleteTask, toggleComplete } = useTaskStore();

  const handlePriorityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left
    });
    setShowPriorityDropdown(!showPriorityDropdown);
  };

  const handleDoubleClick = () => {
    if (isInTrash) return;
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleBlur = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    if (!isInTrash) {
      setIsEditing(true);
      setEditTitle(task.title);
    }
  };

  useEffect(() => {
    if (!showPriorityDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      setShowPriorityDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPriorityDropdown]);

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      data-index={index}
      data-group-id={task.groupId}
      style={{
        cursor: isInTrash ? 'default' : 'pointer',
        userSelect: 'none',
      }}
    >
      <div className="task-content">
        <div className="task-header">
          <div className="priority-wrapper">
            <div
              className="priority-selector"
              onClick={handlePriorityClick}
            >
              <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
            {showPriorityDropdown && createPortal(
              <PriorityDropdown
                position={dropdownPosition}
                currentPriority={task.priority}
                onSelect={(priority) => {
                  updateTask(task.id, { priority: priority as any });
                  setShowPriorityDropdown(false);
                }}
              />,
              document.body
            )}
          </div>
          <div className="title-wrapper" onDoubleClick={handleDoubleClick}>
            {isEditing ? (
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleBlur}
                autoFocus
                className="title-input"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            ) : (
              <span className="title">{task.title}</span>
            )}
          </div>
        </div>
        <div className="task-meta">
          创建于 {format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm')}
        </div>
      </div>

      <div className="task-actions">
        {!isInTrash && (
          <button
            className="action-btn edit"
            onClick={startEditing}
            title="编辑"
          >
            <Edit2 size={16} />
          </button>
        )}
        <button
          className="action-btn delete"
          onClick={() => deleteTask(task.id)}
          title="删除"
        >
          <Trash2 size={16} />
        </button>
        <button
          className={`action-btn complete ${task.completed ? 'active' : ''}`}
          onClick={() => toggleComplete(task.id)}
          title={task.completed ? "标记为未完成" : "标记为已完成"}
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  );
};
