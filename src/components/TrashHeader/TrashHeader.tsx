import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import './TrashHeader.less';

export const TrashHeader: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { trashedTasks, emptyTrash } = useTaskStore();

  const handleEmptyTrash = () => {
    setShowConfirmDialog(false);
    emptyTrash();
  };

  return (
    <div className="trash-header">
      {trashedTasks.length > 0 && (
        <button
          className="empty-trash-btn"
          onClick={() => setShowConfirmDialog(true)}
        >
          <Trash2 size={16} />
          清空垃圾桶
        </button>
      )}

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
