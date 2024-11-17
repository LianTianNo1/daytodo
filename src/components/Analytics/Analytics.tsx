import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { useTagStore } from '../../stores/tagStore';
import { Card } from 'antd';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import './Analytics.less';

export const Analytics: React.FC = () => {
  const { tasks } = useTaskStore();
  const { tags } = useTagStore();

  // 优先级对应的颜色
  const priorityColors = {
    P0: '#ff4d4f',
    P1: '#ffa940',
    P2: '#fadb14',
    P3: '#73d13d',
    P4: '#40a9ff'
  };

  // 计算任务完成率
  const completionRate = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return {
      rate: total ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
      remaining: total - completed
    };
  };

  // 按优先级统计任务
  const priorityStats = () => {
    const stats = tasks.reduce((acc, task) => {
      const priority = task.priority || 'P4';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([priority, count]) => ({
      priority,
      count,
      color: priorityColors[priority as keyof typeof priorityColors]
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
        total: dayTasks.length,
        efficiency: dayTasks.length ? Math.round((dayTasks.filter(t => t.completed).length / dayTasks.length) * 100) : 0
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
    })).sort((a, b) => b.count - a.count);
  };

  const { rate, completed, total, remaining } = completionRate();

  return (
    <motion.div
      className="analytics-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stats-overview">
        <motion.div
          className="stat-card completion-card"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>任务完成率</h3>
          <div className="completion-rate">
            <div className="rate-circle-wrapper">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${rate}, 100`}
                  className="percentage"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1890ff" />
                    <stop offset="100%" stopColor="#722ed1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="rate-number">{rate}%</div>
            </div>
            <div className="rate-detail">
              <div className="stat-item">
                <span className="label">已完成</span>
                <span className="value completed">{completed}</span>
              </div>
              <div className="stat-item">
                <span className="label">待完成</span>
                <span className="value remaining">{remaining}</span>
              </div>
              <div className="stat-item">
                <span className="label">总任务</span>
                <span className="value total">{total}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card priority-card"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
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
                  paddingAngle={2}
                >
                  {priorityStats().map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="custom-tooltip">
                        <p className="priority">{data.priority}</p>
                        <p className="count">{data.count} 个任务</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="priority-legend">
              {Object.entries(priorityColors).map(([priority, color]) => (
                <div key={priority} className="legend-item">
                  <span className="color-dot" style={{ backgroundColor: color }} />
                  <span className="priority-label">{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="trend-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3>任务完成趋势</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionTrend()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  return (
                    <div className="custom-tooltip trend">
                      <p className="date">{label}</p>
                      <p className="completed">完成: {payload[0].value}</p>
                      <p className="total">总数: {payload[1].value}</p>
                      <p className="efficiency">效率: {payload[2].value}%</p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                fill="url(#completedGradient)"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ fill: '#82ca9d', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                fill="url(#totalGradient)"
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#ffc658"
                strokeWidth={2}
                dot={{ fill: '#ffc658', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        className="tag-stats-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3>标签使用统计</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagStats()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis
                dataKey="name"
                stroke="#666"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis stroke="#666" />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p className="tag-name" style={{ color: data.color }}>{label}</p>
                      <p className="tag-count">{data.count} 个任务</p>
                    </div>
                  );
                }}
              />
              {tagStats().map((entry, index) => (
                <Bar
                  key={index}
                  dataKey="count"
                  fill={entry.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};
