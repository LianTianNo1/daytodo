import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { useTagStore } from '../../stores/tagStore';
import { Card } from 'antd';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import './Analytics.less';

export const Analytics: React.FC = () => {
  const { tasks } = useTaskStore();
  const { tags } = useTagStore();

  // 计算任务完成率
  const completionRate = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return {
      rate: total ? Math.round((completed / total) * 100) : 0,
      completed,
      total
    };
  };

  // 按优先级统计任务
  const priorityStats = () => {
    const stats = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([priority, count]) => ({
      priority,
      count
    }));
  };

  // 计算过去7天的任务完成趋势
  const completionTrend = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return isWithinInterval(taskDate, {
          start: startOfDay(date),
          end: endOfDay(date)
        });
      });

      return {
        date: format(date, 'MM-dd'),
        completed: dayTasks.filter(t => t.completed).length,
        total: dayTasks.length
      };
    }).reverse();

    return days;
  };

  // 标签使用频率
  const tagStats = () => {
    const stats = tasks.reduce((acc, task) => {
      task.tags.forEach(tagId => {
        acc[tagId] = (acc[tagId] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return tags.map(tag => ({
      name: tag.name,
      count: stats[tag.id] || 0,
      color: tag.color
    }));
  };

  const { rate, completed, total } = completionRate();

  return (
    <div className="analytics-container">
      <div className="stats-overview">
        <Card className="stat-card">
          <h3>任务完成率</h3>
          <div className="completion-rate">
            <div className="rate-circle">
              <span className="rate-number">{rate}%</span>
            </div>
            <div className="rate-detail">
              <p>已完成: {completed}</p>
              <p>总任务: {total}</p>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <h3>优先级分布</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityStats()}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="trend-card">
        <h3>任务完成趋势</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionTrend()}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="tag-stats-card">
        <h3>标签使用统计</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagStats()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
