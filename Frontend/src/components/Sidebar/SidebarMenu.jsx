import { useState } from 'react';
import {
  Home,
  BookOpen,
  ChevronRight,
  ChevronUp,
  CalendarDays,
  StickyNote,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import LoaderText from '../Loader/LoaderText';
import ChangePasswordModal from './ChangePasswordModal';
import { useToastContext } from '../../contexts/ToastContext';
import ThemeModal from './ThemeModal';

function Sidebar({ isOpen, setIsOpen }) {
  const { data: profileData, loadingProfile, errorProfile } = useProfile();
  const user = profileData.profile;
  const { show } = useToastContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [PasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [menuItems] = useState([
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
    { icon: StickyNote, label: 'Notes', href: '/notes' },
    { icon: CalendarDays, label: 'Calendar', href: '/calendar' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]);
  const location = useLocation().pathname;
  const { logout } = useAuth();

  const getImageUrl = (fileName) => {
    return `${import.meta.env.VITE_ASSETS_URL}/${fileName}`;
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Password change failed');

      setPasswordModalOpen(false);

      show(data.message || 'Password changed successfully', 'success');
    } catch (error) {
      show(error.message || 'Error changing password', 'error');
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => {
            setIsOpen(false);
            setMenuOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[rgb(var(--card))] border-r border-[rgb(var(--border))] z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          w-64 shadow-xl
        `}
      >
        {/* Header */}
        <div className="h-20 p-2 mt-4 border-b border-[rgb(var(--border))] img-container flex items-center justify-center">
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
            const isActive =
              location === item.href || (location === '/' && item.href === '/dashboard');
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => {
                  setIsOpen(false);
                  setMenuOpen(false);
                }}
                className={`
                  flex items-center mt-4 mb-4 no-underline justify-between p-3 rounded-lg transition-all duration-200 group 
                  ${
                    isActive
                      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--card))] border border-[rgb(var(--border))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--hover))]'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    size={20}
                    className={
                      isActive ? 'text-[rgb(var(--card))]' : ''
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
        <div className="absolute bottom-0 rounded-lg left-0 right-0 p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))]">
          {loadingProfile ? (
            <LoaderText />
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center space-x-3 p-3 rounded-lg w-full"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {!user.profile_pic ? (
                    <User size={16} className="text-gray-600" />
                  ) : (
                    <img
                      src={getImageUrl(user.profile_pic)}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-[rgb(var(--text))] truncate">
                    {loadingProfile ? '' : user.username}
                  </p>
                  <p className="text-xs text-[rgb(var(--text-secondary))] truncate">
                    {loadingProfile ? '' : user.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronUp
                    size={16}
                    className={`transition-transform duration-200 opacity-100 group-hover:opacity-100 text-gray-400
                    ${menuOpen ? 'transform rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Drop-up Menu */}
              <div
                className={`
                absolute bottom-16 left-4 w-48 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg z-50
                transform transition-all duration-200 origin-bottom
                ${
                  menuOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                }`}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setThemeModalOpen(true);
                  }}
                  className="block px-4 py-2 text-sm text-[rgb(var(--text))] hover:bg-[rgb(var(--hover))] w-full text-left"
                >
                  Switch Theme
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setPasswordModalOpen(true);
                  }}
                  className="block px-4 py-2 text-sm text-[rgb(var(--text))] hover:bg-[rgb(var(--hover))] w-full text-left"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowConfirmModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[rgb(var(--hover))]"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {PasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleChangePassword}
        />
      )}
      {themeModalOpen && (
        <ThemeModal open={() => setThemeModalOpen(true)} onClose={() => setThemeModalOpen(false)} />
      )}
      {showConfirmModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-[rgb(var(--card))] rounded-lg shadow-xl p-6 w-80 text-center
                   transform transition-all duration-300 ease-out
                   opacity-100 translate-y-0"
              style={{
                animation: 'popUp 0.3s ease forwards',
              }}
            >
              <h2 className="text-lg font-semibold mb-4 text-[rgb(var(--text))]">Confirm Logout</h2>
              <p className="text-sm text-[rgb(var(--text-secondary))] mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-sm rounded border border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--hover))] text-[rgb(var(--text-secondary))]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    logout();
                  }}
                  className="flex-1 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-[rgb(var(--text))]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes popUp {
              0% {
                opacity: 0;
                transform: translateY(50px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}

export default Sidebar;
