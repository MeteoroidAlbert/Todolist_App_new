import './App.css';
import Dashboard from './components/Dashboard';
import { AppProvider } from './components/AppProvider'; //使用Context API管理狀態

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
