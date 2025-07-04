import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import Header from '../../components/Header/Header';

function Layout(){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(open => !open);

  return (
    <div className="flex h-screen w-full">
      <SidebarMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col lg:p-4 p-2">
        <Header isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-white-100 p-0 lg:p-3 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
