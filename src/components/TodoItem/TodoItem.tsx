import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, Trash2, Calendar } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div className="todo-header" onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <textarea
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="edit-input"
              rows={2}
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
          <span className="created-at">
            创建于 {format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm')}
          </span>
          {task.startDate && (
            <span className="start-date">
              <Calendar size={12} />
              开始于 {format(new Date(task.startDate), 'yyyy-MM-dd HH:mm')}
            </span>
          )}
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={12} />
              截止于 {format(new Date(task.dueDate), 'yyyy-MM-dd HH:mm')}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          className={`action-btn complete ${task.completed ? 'active' : ''}`}
          onClick={() => toggleComplete(task.id)}
          title={task.completed ? "标记为未完成" : "标记为已完成"}
        >
          <Check size={16} />
        </button>
        <button
          className="action-btn delete"
          onClick={() => deleteTask(task.id)}
          title="删除"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
