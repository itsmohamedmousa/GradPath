import { useEffect } from 'react';
import AppRoutes from './Root/Layout/Routes'

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  return <AppRoutes />;
}

export default App
