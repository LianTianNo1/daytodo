import React, { useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTaskStore } from '../../stores/taskStore';
import { TodoInput } from '../TodoInput/TodoInput';
import { TaskItem } from '../TaskItem/TaskItem';
import { TrashView } from '../TrashView/TrashView';
import './TodoList.less';

export const TodoList: React.FC = () => {
  const { tasks, currentGroupId, reorderTasks } = useTaskStore();

  const moveTask = useCallback(
    (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => {
      reorderTasks(dragIndex, hoverIndex, sourceGroupId, targetGroupId);
    },
    [reorderTasks]
  );

  // 添加鼠标事件处理
  useEffect(() => {
    let draggedItem: HTMLElement | null = null;
    let draggedIndex: number = -1;

    const handleDragStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const taskItem = target.closest('.task-item') as HTMLElement;
      if (!taskItem) return;

      draggedItem = taskItem;
      draggedIndex = parseInt(taskItem.dataset.index || '-1');

      requestAnimationFrame(() => {
        if (draggedItem) {
          draggedItem.style.opacity = '0.4';
        }
      });
    };

    const handleDragOver = (e: MouseEvent) => {
      e.preventDefault();
      if (!draggedItem) return;

      const target = e.target as HTMLElement;
      const taskItem = target.closest('.task-item') as HTMLElement;
      if (!taskItem || taskItem === draggedItem) return;

      const hoverIndex = parseInt(taskItem.dataset.index || '-1');
      if (hoverIndex === -1 || draggedIndex === -1) return;

      const sourceGroupId = draggedItem.dataset.groupId || '';
      const targetGroupId = taskItem.dataset.groupId || '';

      moveTask(draggedIndex, hoverIndex, sourceGroupId, targetGroupId);
      draggedIndex = hoverIndex;
    };

    const handleDragEnd = () => {
      if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem = null;
        draggedIndex = -1;
      }
    };

    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragOver);
    document.addEventListener('mouseup', handleDragEnd);

    return () => {
      document.removeEventListener('mousedown', handleDragStart);
      document.removeEventListener('mousemove', handleDragOver);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [moveTask]);

  if (currentGroupId === 'trash') {
    return <TrashView />;
  }

  const filteredTasks = currentGroupId
    ? tasks.filter(task => task.groupId === currentGroupId)
    : tasks;

  return (
    <div className="todo-list">
      <TodoInput />
      <div
        className="task-items"
        style={{
          height: '100%',
          overflowY: 'auto',
          paddingBottom: '16px'
        }}
      >
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <p>暂无待办事项</p>
            <p className="hint">按回车键快速创建新任务</p>
          </div>
        )}
      </div>
    </div>
  );
};
