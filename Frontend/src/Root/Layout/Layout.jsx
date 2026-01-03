import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import Header from '../../components/Header/Header';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="flex h-screen w-full">
      <SidebarMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col lg:p-4 p-2 lg:py-0 py-0 overflow-y-auto scroll-smooth">
        <Header isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-[rgb(var(--bg))] py-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
