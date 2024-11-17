import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { Check, Trash2, Edit2, Tag, Calendar, RotateCcw } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { PriorityDropdown } from '../PriorityDropdown/PriorityDropdown';
import { Task } from '../../types/task';
import { useTagStore } from '../../stores/tagStore';
import './TaskItem.less';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useDrag, useDrop } from 'react-dnd';

interface TaskItemProps {
  task: Task;
  isInTrash?: boolean;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isInTrash, index, moveTask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { updateTask, deleteTask, toggleComplete, restoreTask, permanentlyDeleteTask } = useTaskStore();
  const { tags: allTags } = useTagStore();

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

  const handleDueDateChange = (date: dayjs.Dayjs | null) => {
    updateTask(task.id, {
      dueDate: date ? date.toISOString() : undefined
    });
  };

  useEffect(() => {
    if (!showPriorityDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      setShowPriorityDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPriorityDropdown]);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index, groupId: task.groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isInTrash,
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item: { index: number, groupId: string }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceGroupId = item.groupId;
      const targetGroupId = task.groupId;

      if (dragIndex === hoverIndex && sourceGroupId === targetGroupId) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(dragIndex, hoverIndex, sourceGroupId, targetGroupId);
      item.index = hoverIndex;
      item.groupId = targetGroupId;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      data-index={index}
      data-group-id={task.groupId}
      style={{
        cursor: isInTrash ? 'default' : 'move',
        opacity: isDragging ? 0.5 : 1,
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
          <span>创建于 {format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm')}</span>
          {task.dueDate && (
            <span className="due-date">
              <Calendar size={12} />
              截止于 {format(new Date(task.dueDate), 'yyyy-MM-dd')}
            </span>
          )}
        </div>
        <div className="task-tags">
          {task.tags?.map(tagId => {
            const tag = allTags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <span
                key={tag.id}
                className="tag"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <Tag size={12} />
                {tag.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="task-actions">
        {isInTrash ? (
          <>
            <button
              className="action-btn restore"
              onClick={() => restoreTask(task.id)}
              title="恢复"
            >
              <RotateCcw size={16} />
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
              className="action-btn edit"
              onClick={startEditing}
              title="编辑"
            >
              <Edit2 size={16} />
            </button>
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
            <DatePicker
              className="date-picker"
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={handleDueDateChange}
              placeholder="设置截止日期"
              format="YYYY-MM-DD"
              allowClear
            />
          </>
        )}
      </div>
    </div>
  );
};
