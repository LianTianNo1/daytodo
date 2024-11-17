import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskFilter } from '../TaskFilter/TaskFilter';
import { TodoInput } from '../TodoInput/TodoInput';
import './TodoList.less';

export const TodoList: React.FC = () => {
  const { getFilteredTasks, reorderTasks } = useTaskStore();
  const tasks = getFilteredTasks();

  const moveTask = (dragIndex: number, hoverIndex: number, sourceGroupId: string, targetGroupId: string) => {
    reorderTasks(dragIndex, hoverIndex, sourceGroupId, targetGroupId);
  };

  return (
    <div className="todo-list">
      <div className="main-content">
        <TodoInput />
        <DndProvider backend={HTML5Backend}>
          <div className="task-items">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
              />
            ))}
            {tasks.length === 0 && (
              <div className="empty-state">
                <p>暂无任务</p>
                <p className="hint">创建一个新任务试试吧</p>
              </div>
            )}
          </div>
        </DndProvider>
      </div>
      <TaskFilter />
    </div>
  );
};
