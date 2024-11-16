import { TabBar } from './components/TabBar/TabBar';
import { GroupList } from './components/GroupList/GroupList';
import { TodoList } from './components/TodoList/TodoList';
import './App.less';

function App() {
  return (
    <div className="app-container">
      <TabBar />
      <div className="main-content">
        <GroupList />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
