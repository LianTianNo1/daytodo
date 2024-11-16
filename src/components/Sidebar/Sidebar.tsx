import React from 'react';
import { useGroupStore } from '../../stores/groupStore';
import { PlusCircle, LayoutGrid } from 'lucide-react';
import './Sidebar.less';

export const Sidebar: React.FC = () => {
  const groups = useGroupStore(state => state.groups);
  const addGroup = useGroupStore(state => state.addGroup);

  const handleAddGroup = () => {
    addGroup({
      name: '新分组',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">DayTodo</h2>
      </div>

      <div className="space-y-2">
        <button
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
          onClick={() => {}}
        >
          <LayoutGrid className="w-5 h-5 mr-2" />
          <span>所有任务</span>
        </button>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">分组</span>
            <button
              onClick={handleAddGroup}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {groups.map(group => (
            <button
              key={group.id}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
              style={{ color: group.color }}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: group.color }}
              />
              <span>{group.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
