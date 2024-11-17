import React from 'react';
import { DatePicker } from 'antd';
import { useTaskStore } from '../../stores/taskStore';
import { useTagStore } from '../../stores/tagStore';
import { Tag as TagIcon, Calendar, X, AlertCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import './TaskFilter.less';

const { RangePicker } = DatePicker;

const priorities = ['P0', 'P1', 'P2', 'P3', 'P4'] as const;

export const TaskFilter: React.FC = () => {
  const { filters, setTagFilter, setDateRangeFilter, setPriorityFilter, setOverdueFilter, clearFilters } = useTaskStore();
  const { tags } = useTagStore();

  const handleTagClick = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    setTagFilter(newTags);
  };

  const handlePriorityClick = (priority: typeof priorities[number]) => {
    const newPriorities = filters.priorities?.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    setPriorityFilter(newPriorities);
  };

  const handleDateRangeChange = (dates: any) => {
    if (!dates) {
      setDateRangeFilter(undefined, undefined);
      return;
    }
    const [start, end] = dates;
    setDateRangeFilter(
      start ? start.toISOString() : undefined,
      end ? end.toISOString() : undefined
    );
  };

  return (
    <div className="task-filter">
      <div className="filter-section">
        <div className="section-header">
          <Clock size={16} />
          <span>快捷筛选</span>
          {filters.showOverdue && (
            <button className="clear-btn" onClick={() => setOverdueFilter(false)}>
              清除
            </button>
          )}
        </div>
        <div className="quick-filters">
          <span
            className={`filter-tag ${filters.showOverdue ? 'active' : ''}`}
            style={{
              backgroundColor: filters.showOverdue ? '#ff4d4f' : 'rgba(255, 77, 79, 0.1)',
              color: filters.showOverdue ? 'white' : '#ff4d4f'
            }}
            onClick={() => setOverdueFilter(!filters.showOverdue)}
          >
            <Clock size={12} />
            已过期
          </span>
        </div>
      </div>

      <div className="filter-section">
        <div className="section-header">
          <AlertCircle size={16} />
          <span>优先级筛选</span>
          {filters.priorities?.length > 0 && (
            <button className="clear-btn" onClick={() => setPriorityFilter([])}>
              清除
            </button>
          )}
        </div>
        <div className="priority-list">
          {priorities.map(priority => (
            <span
              key={priority}
              className={`priority-tag ${priority.toLowerCase()} ${
                filters.priorities?.includes(priority) ? 'active' : ''
              }`}
              onClick={() => handlePriorityClick(priority)}
            >
              {priority}
            </span>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="section-header">
          <TagIcon size={16} />
          <span>标签筛选</span>
          {filters.tags.length > 0 && (
            <button className="clear-btn" onClick={() => setTagFilter([])}>
              清除
            </button>
          )}
        </div>
        <div className="tag-list">
          {tags.map(tag => (
            <span
              key={tag.id}
              className={`filter-tag ${filters.tags.includes(tag.id) ? 'active' : ''}`}
              style={{
                backgroundColor: filters.tags.includes(tag.id) ? tag.color : `${tag.color}20`,
                color: filters.tags.includes(tag.id) ? 'white' : tag.color
              }}
              onClick={() => handleTagClick(tag.id)}
            >
              <TagIcon size={12} />
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="section-header">
          <Calendar size={16} />
          <span>日期范围</span>
          {(filters.dateRange.start || filters.dateRange.end) && (
            <button className="clear-btn" onClick={() => setDateRangeFilter(undefined, undefined)}>
              清除
            </button>
          )}
        </div>
        <RangePicker
          value={[
            filters.dateRange.start ? dayjs(filters.dateRange.start) : null,
            filters.dateRange.end ? dayjs(filters.dateRange.end) : null
          ]}
          onChange={handleDateRangeChange}
          allowClear
        />
      </div>

      {(filters.tags.length > 0 || filters.priorities?.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
        <button className="clear-all-btn" onClick={clearFilters}>
          清除所有筛选
          <X size={14} />
        </button>
      )}
    </div>
  );
};
