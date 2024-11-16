import React from 'react';
import './PriorityDropdown.less';

interface PriorityDropdownProps {
  position: { top: number; left: number };
  currentPriority: string;
  onSelect: (priority: string) => void;
}

export const PriorityDropdown: React.FC<PriorityDropdownProps> = ({
  position,
  currentPriority,
  onSelect,
}) => {
  const priorities = ['P0', 'P1', 'P2', 'P3', 'P4'];

  return (
    <div
      className="priority-dropdown-container"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {priorities.map(priority => (
        <div
          key={priority}
          className={`priority-option ${priority.toLowerCase()} ${
            currentPriority === priority ? 'active' : ''
          }`}
          onClick={() => onSelect(priority)}
        >
          {priority}
        </div>
      ))}
    </div>
  );
};
