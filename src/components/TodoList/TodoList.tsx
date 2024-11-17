import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskFilter } from '../TaskFilter/TaskFilter';
import { TodoInput } from '../TodoInput/TodoInput';
import { TrashHeader } from '../TrashHeader/TrashHeader';
import './TodoList.less';

export const TodoList: React.FC = () => {
  const { getFilteredTasks, reorderTasks } = useTaskStore();
  const currentGroupId = useTaskStore(state => state.currentGroupId);
  const tasks = getFilteredTasks();

  const moveTask = (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => {
    reorderTasks(dragIndex, hoverIndex, sourceGroupId, targetGroupId);
  };

  return (
    <div className="todo-list">
      <div className="main-content">
        {currentGroupId === 'trash' ? (
          <TrashHeader />
        ) : (
          <TodoInput />
        )}
        <DndProvider backend={HTML5Backend}>
          <div className="task-items">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
                isInTrash={currentGroupId === 'trash'}
              />
            ))}
            {tasks.length === 0 && (
              <div className="empty-state">
                <p>{currentGroupId === 'trash' ? '垃圾桶是空的' : '暂无任务'}</p>
                {currentGroupId !== 'trash' && (
                  <p className="hint">创建一个新任务试试吧</p>
                )}
              </div>
            )}
          </div>
        </DndProvider>
      </div>
      <TaskFilter />
    </div>
  );
};
