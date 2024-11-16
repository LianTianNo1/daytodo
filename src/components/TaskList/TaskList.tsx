import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from '../TaskItem/TaskItem';

export const TaskList: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
