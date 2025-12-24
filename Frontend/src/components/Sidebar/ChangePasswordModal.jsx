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
    if (confirmPassword !== newPassword) {
      show('New password and confirmation do not match', 'warning');
      return;
    }else if (newPassword.length < 6) {
      show('New password must be at least 6 characters long', 'warning');
      return;
    }
    e.preventDefault();
    onSubmit({ currentPassword, newPassword });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-xl p-6 w-80 text-center"
          style={{
            animation: 'popUp 0.3s ease forwards',
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          {/* Current Password */}
          <div className="flex flex-col text-left relative">
            <input
              type={currentHidden ? 'password' : 'text'}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <div
              className="absolute right-2 inset-y-0 flex items-center cursor-pointer text-gray-500"
              onClick={() => setCurrentHidden(!currentHidden)}
            >
              {currentHidden ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col text-left relative">
            <input
              type={newHidden ? 'password' : 'text'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 ${
                newPassword.length < 6 ||
                (newPassword && confirmPassword && newPassword !== confirmPassword)
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <div
              className="absolute right-2 inset-y-0 flex items-center cursor-pointer text-gray-500"
              onClick={() => setNewHidden(!newHidden)}
            >
              {newHidden ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col text-left relative">
            <input
              type={newHidden ? 'password' : 'text'} // same as newPassword
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 ${
                newPassword.length < 6 ||
                (newPassword && confirmPassword && newPassword !== confirmPassword)
                  ? 'border-red-500 ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white ${
                !currentPassword ||
                !newPassword ||
                newPassword !== confirmPassword ||
                newPassword.length <= 6
                  ? 'opacity-50 cursor-not-allowed disabled'
                  : ''
              }`}
            //   disabled={
            //     !currentPassword ||
            //     !newPassword ||
            //     newPassword !== confirmPassword ||
            //     newPassword.length <= 6
            //   }
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
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
