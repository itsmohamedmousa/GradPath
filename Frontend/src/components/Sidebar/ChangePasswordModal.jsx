import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useToastContext } from '../../contexts/ToastContext';

export default function ChangePasswordModal({ onClose, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentHidden, setCurrentHidden] = useState(true);
  const [newHidden, setNewHidden] = useState(true);
  const { show } = useToastContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = getErrorMessage();
    if (error) {
      show(error, 'warning');
      return;
    }

    onSubmit({ currentPassword, newPassword });
  };

  const isInvalid =
    (newPassword.length > 0 && newPassword.length < 6) ||
    (confirmPassword.length > 0 && newPassword !== confirmPassword);

  const getErrorMessage = () => {
    if (!currentPassword) return 'Current password is required';
    if (!newPassword) return 'New password is required';
    if (newPassword !== confirmPassword) return 'New password and confirmation do not match';
    if (newPassword.length < 6) return 'Password must be at least 6 characters long';
    return null;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="bg-[rgb(var(--card))] rounded-xl shadow-2xl p-6 w-full max-w-sm text-center"
          style={{ animation: 'popUp 0.25s ease forwards' }}
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--text))] mb-5">Change Password</h2>

          {/* Current Password */}
          <div className="relative mb-4">
            <input
              type={currentHidden ? 'password' : 'text'}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-[rgb(var(--border))] rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition"
            />
            <div
              className="absolute right-3 inset-y-0 flex items-center cursor-pointer text-[rgb(var(--text-secondary))] hover:text-gray-600 transition"
              onClick={() => setCurrentHidden(!currentHidden)}
            >
              {currentHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* New Password */}
          <div className="relative mb-4">
            <input
              type={newHidden ? 'password' : 'text'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2.5 border border-[rgb(var(--border))] rounded-md text-sm
                          focus:outline-none focus:ring-2 transition
                ${
                  newPassword.length > 0 && isInvalid
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            <div
              className="absolute right-3 inset-y-0 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition"
              onClick={() => setNewHidden(!newHidden)}
            >
              {newHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="relative mb-6">
            <input
              type={newHidden ? 'password' : 'text'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2.5 border border-[rgb(var(--border))] rounded-md text-sm
                          focus:outline-none focus:ring-2 transition
                ${
                  confirmPassword.length > 0 && isInvalid
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm rounded-md
                         bg-[rgb(var(--card))] hover:bg-[rgb(var(--hover))]
                         text-[rgb(var(--text-secondary))] transition border border-[rgb(var(--border))]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 py-2.5 text-sm rounded-md font-medium transition
                          ${
                            getErrorMessage()
                              ? `
                                bg-[rgb(var(--primary))]/50
                                text-[rgb(var(--text))]/70
                                cursor-not-allowed
                                pointer-events-auto
                              `
                              : `
                                bg-[rgb(var(--primary))]
                                hover:bg-[rgb(var(--primary-hover))]
                                text-[rgb(var(--text))]
                                cursor-pointer
                              `
                          }
                        `}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes popUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
