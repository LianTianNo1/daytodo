import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabBar } from './components/TabBar/TabBar';
import { GroupList } from './components/GroupList/GroupList';
import { TodoList } from './components/TodoList/TodoList';
import { Analytics } from './components/Analytics/Analytics';
import './App.less';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <div className="app-container">
          <TabBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <GroupList />
                  <TodoList />
                </>
              } />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
