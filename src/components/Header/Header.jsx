import { useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

function Header({ toggleSidebar }) {
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
      <header className="rounded-lg bg-blue-600 text-white text-xl font-bold p-4 shadow-md h-16 flex items-center justify-between w-full">
        {currentPage}
        <button
          onClick={toggleSidebar}
          className="p-2 w-15 h-15 rounded-full bg-transparent text-white lg:hidden transition-colors duration-200"
        >
          <Menu size={35} />
        </button>
      </header>
    </>
  );
}

export default Header;
