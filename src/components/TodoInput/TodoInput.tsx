import React, { useState, useRef } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { useTagStore } from '../../stores/tagStore';
import { ChevronDown, Tag as TagIcon, X } from 'lucide-react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import './TodoInput.less';

const priorities = ['P0', 'P1', 'P2', 'P3', 'P4'] as const;

export const TodoInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('P2');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();

  const addTask = useTaskStore(state => state.addTask);
  const currentGroupId = useTaskStore(state => state.currentGroupId);
  const { tags } = useTagStore();

  const tagButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      addTask({
        title: title.trim(),
        priority: priority as 'P0' | 'P1' | 'P2' | 'P3' | 'P4',
        completed: false,
        groupId: currentGroupId,
        tags: selectedTags,
        startDate,
        dueDate,
      });
      setTitle('');
      setSelectedTags([]);
      setStartDate(undefined);
      setDueDate(undefined);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    setShowTagDropdown(false);
  };

  return (
    <div className="todo-input-container">
      <div className="priority-selector" onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}>
        <span className={`priority-tag ${priority.toLowerCase()}`}>{priority}</span>
        <ChevronDown size={16} />
        {showPriorityDropdown && (
          <div className="priority-dropdown">
            {priorities.map(p => (
              <div
                key={p}
                className={`priority-option ${p.toLowerCase()}`}
                onClick={() => {
                  setPriority(p);
                  setShowPriorityDropdown(false);
                }}
              >
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tag-selector">
        <button
          ref={tagButtonRef}
          className="tag-button"
          onClick={() => setShowTagDropdown(!showTagDropdown)}
        >
          <TagIcon size={16} />
        </button>
        {showTagDropdown && (
          <div className="tag-dropdown">
            {tags.map(tag => (
              <div
                key={tag.id}
                className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.id)}
                style={{ color: tag.color }}
              >
                <TagIcon size={12} />
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="selected-tags">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className="selected-tag"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              <TagIcon size={12} />
              {tag.name}
              <button
                className="remove-tag"
                onClick={() => toggleTag(tag.id)}
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
      </div>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="添加新任务，按回车保存"
        className="todo-input"
      />

      <div className="date-pickers">
        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={(date) => setStartDate(date?.toISOString())}
          placeholder="开始日期"
          format="YYYY-MM-DD"
          allowClear
        />
        <DatePicker
          value={dueDate ? dayjs(dueDate) : null}
          onChange={(date) => setDueDate(date?.toISOString())}
          placeholder="截止日期"
          format="YYYY-MM-DD"
          allowClear
        />
      </div>
    </div>
  );
};
