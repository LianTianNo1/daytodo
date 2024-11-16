import React from 'react';
import { CheckSquare } from 'lucide-react';
import './TabBar.less';

export const TabBar: React.FC = () => {
  return (
    <div className="tab-bar">
      <div className="tab-item active">
        <CheckSquare className="tab-icon" />
        <span>待办事项</span>
      </div>
    </div>
  );
};
