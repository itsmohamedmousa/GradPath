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
      <header className="sticky top-0 z-10 border border-white/20 lg:h-20 h-13 rounded-xl text-blue-600 bg-white/10 backdrop-blur-sm lg:text-3xl text-xl shadow-md font-bold p-4 lg:mt-3 mt-2 flex items-center justify-between w-full font-[Playfair_Display]">
        <img
          src="/src/assets/Logo-mini-no-bg.png"
          alt="Logo"
          className="lg:hidden w-13 rounded-full"
        />
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
