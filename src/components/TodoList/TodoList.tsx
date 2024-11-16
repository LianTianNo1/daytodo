import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TodoInput } from '../TodoInput/TodoInput';
import { TaskItem } from '../TaskItem/TaskItem';
import { TrashView } from '../TrashView/TrashView';
import './TodoList.less';

export const TodoList: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const currentGroupId = useTaskStore(state => state.currentGroupId);

  if (currentGroupId === 'trash') {
    return <TrashView />;
  }

  const filteredTasks = currentGroupId
    ? tasks.filter(task => task.groupId === currentGroupId)
    : tasks;

  return (
    <div className="todo-list">
      <TodoInput />
      <div className="task-items">
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} />
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
