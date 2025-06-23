import { Outlet } from 'react-router-dom';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';

const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      <SidebarMenu />
      <main className='flex-1 bg-gray-100 p-4 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
