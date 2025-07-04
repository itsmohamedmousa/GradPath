import { useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

function Header({ toggleSidebar, isOpen }) {
  const location = useLocation();

  const pageTitles = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/courses': 'Courses',
    '/notes': 'Notes',
    '/calendar': 'Calendar',
    '/profile': 'Profile',
  };

  const currentPage = pageTitles[location.pathname];
  return (
    <>
      <header className="border border-gray-200 lg:h-20 h-16 rounded-md text-blue-600 bg-white lg:text-3xl text-xl shadow-sm font-bold p-4 flex items-center justify-between w-full">
        {currentPage}
        <button
          onClick={toggleSidebar}
          className="rounded-full bg-transparent text-blue-600 lg:hidden duration-200"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </header>
    </>
  );
}

export default Header;
