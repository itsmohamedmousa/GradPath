import { useEffect } from 'react';

export default function useBootstrap() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    link.id = 'bootstrap-css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
}
