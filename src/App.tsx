import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { TabBar } from './components/TabBar/TabBar';
import { GroupList } from './components/GroupList/GroupList';
import { TodoList } from './components/TodoList/TodoList';
import './App.less';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app-container">
        <TabBar />
        <div className="main-content">
          <GroupList />
          <TodoList />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
