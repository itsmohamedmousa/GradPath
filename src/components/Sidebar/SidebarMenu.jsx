import { useState } from 'react';
import {
  Home,
  BookOpen,
  Menu,
  X,
  ChevronRight,
  CalendarDays,
  StickyNote,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
    { icon: StickyNote, label: 'Notes', href: '/notes' },
    { icon: CalendarDays, label: 'Calendar', href: '/calendar' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]);
  const location = useLocation().pathname;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-1 z-50 p-2 w-15 h-15 rounded-full bg-transparent text-black lg:hidden transition-colors duration-200"
      >
        {isOpen ? <X size={35} /> : <Menu size={35} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 shadow-lg lg:shadow-none
      `}
      >
        {/* Header */}
        <div className="h-20 p-2 mt-4 border-b border-gray-200 img-container flex items-center justify-center">
          <img
            src="/src/assets/Logo-no-bg-landscape.png"
            alt="logo"
            className="w-49 h-auto mx-auto mb-4"
          />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex flex-col overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                  flex items-center mt-4 mb-4 no-underline justify-between p-3 rounded-lg transition-all duration-200 group 
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    size={20}
                    className={
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }
                  />
                  <span className="font-medium">{item.label}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <ChevronRight
                    size={16}
                    className={`
                      transition-transform duration-200 opacity-100 group-hover:opacity-100
                      ${item.active ? 'text-blue-600' : 'text-gray-400'}
                    `}
                  />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
