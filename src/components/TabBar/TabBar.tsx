import React from 'react';
import { CheckSquare, BarChart2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabBar.less';

export const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="tab-bar">
      <div
        className={`tab-item ${currentPath === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <CheckSquare className="tab-icon" />
        <span>待办事项</span>
      </div>
      <div
        className={`tab-item ${currentPath === '/analytics' ? 'active' : ''}`}
        onClick={() => navigate('/analytics')}
      >
        <BarChart2 className="tab-icon" />
        <span>统计分析</span>
      </div>
    </div>
  );
};
