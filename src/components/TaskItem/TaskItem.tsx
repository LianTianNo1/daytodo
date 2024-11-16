import React, { useState } from 'react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import { Trash2, Check, ChevronDown, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import './TaskItem.less';

interface TaskItemProps {
  task: Task;
  isInTrash?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isInTrash }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const { updateTask, deleteTask, restoreTask, permanentlyDeleteTask, toggleComplete } = useTaskStore();

  const priorities = ['P0', 'P1', 'P2', 'P3', 'P4'];

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleTitleBlur = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handlePriorityChange = (newPriority: string) => {
    updateTask(task.id, { priority: newPriority as Task['priority'] });
    setShowPriorityDropdown(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <div className="priority-wrapper">
            <div
              className="priority-selector"
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <ChevronDown size={14} />
              {showPriorityDropdown && (
                <div className="priority-dropdown">
                  {priorities.map(p => (
                    <div
                      key={p}
                      className={`priority-option ${p.toLowerCase()}`}
                      onClick={() => handlePriorityChange(p)}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="title-wrapper" onDoubleClick={handleTitleDoubleClick}>
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyPress={handleTitleKeyPress}
                onBlur={handleTitleBlur}
                autoFocus
                className="title-input"
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
        {isInTrash ? (
          <>
            <button
              className="action-btn restore"
              onClick={() => restoreTask(task.id)}
              title="恢复到原分组"
            >
              <ArrowUpCircle size={16} />
            </button>
            <button
              className="action-btn delete"
              onClick={() => permanentlyDeleteTask(task.id)}
              title="永久删除"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
