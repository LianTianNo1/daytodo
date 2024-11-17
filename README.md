# DayTodo

一个现代化的待办事项管理应用，帮助您高效管理日常任务。

## 功能特点

### 任务管理
- ✨ 创建、编辑、删除任务
- 📋 任务分组管理
- 🏷️ 标签系统
- ⭐ 优先级设置（P0-P4）
- 📅 任务日期管理（开始时间、截止时间）
- ✅ 任务完成状态追踪
- 🗑️ 回收站功能

### 分组功能
- 📁 创建自定义分组
- 🎨 分组颜色个性化
- 🔄 分组重命名
- 🗑️ 分组删除（含任务迁移）

### 数据分析
- 📊 任务完成率统计
- 📈 任务趋势分析
- 🏷️ 标签使用统计
- ⭐ 优先级分布分析

### 用户体验
- 🎯 拖拽排序
- 🔍 多维度筛选
- 💫 流畅动画效果
- 🌓 磨砂玻璃视觉效果

## 技术栈

- React 18
- TypeScript
- Zustand (状态管理)
- React Router (路由管理)
- Ant Design (UI组件)
- Recharts (数据可视化)
- React DnD (拖拽功能)
- Date-fns (日期处理)
- Lucide React (图标)
- Framer Motion (动画效果)

## 开发说明

### 安装依赖

```bash
npm install
```

### 运行开发环境

```bash
npm run tauri:dev
```

### 项目结构

```bash
src/
├── components/ # 组件目录
│ ├── Analytics/ # 数据分析相关组件
│ ├── GroupList/ # 分组管理组件
│ ├── TaskItem/ # 任务项组件
│ ├── TodoInput/ # 任务输入组件
│ └── ...
├── stores/ # 状态管理
│ ├── taskStore.ts # 任务状态管理
│ ├── groupStore.ts # 分组状态管理
│ └── tagStore.ts # 标签状态管理
├── types/ # TypeScript 类型定义
├── styles/ # 全局样式
└── services/ # 服务层
```

## 使用说明

1. 任务管理
   - 双击任务标题可以编辑
   - 点击设置图标可以修改任务详情
   - 拖拽任务可以改变顺序

2. 分组管理
   - 点击"添加分组"创建新分组
   - 双击分组名称可以重命名
   - 删除分组时可以选择将任务移动到默认分组

3. 数据分析
   - 查看任务完成情况
   - 分析任务分布
   - 追踪效率趋势

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
