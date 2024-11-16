import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from '../TaskItem/TaskItem';
import { Trash2 } from 'lucide-react';
import './TrashView.less';

export const TrashView: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { trashedTasks, emptyTrash } = useTaskStore();

  const handleEmptyTrash = () => {
    setShowConfirmDialog(false);
    emptyTrash();
  };

  return (
    <div className="trash-view">
      <div className="trash-header">
        <h2>垃圾桶</h2>
        {trashedTasks.length > 0 && (
          <button
            className="empty-trash-btn"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Trash2 size={16} />
            清空垃圾桶
          </button>
        )}
      </div>

      <div className="trashed-items">
        {trashedTasks.map(task => (
          <TaskItem key={task.id} task={task} isInTrash />
        ))}
        {trashedTasks.length === 0 && (
          <div className="empty-state">
            <p>垃圾桶是空的</p>
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>确认清空垃圾桶？</h3>
            <p>此操作将永久删除所有在垃圾桶中的任务，无法恢复。</p>
            <div className="dialog-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
              >
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={handleEmptyTrash}
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
