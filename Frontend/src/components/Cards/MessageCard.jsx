import { useState, useEffect } from 'react';

export default function MessageCard({ message, type, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const colors = {
    success:
      'bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800',
    info: 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800',
    warning:
      'bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800',
    error:
      'bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800',
    default:
      'bg-gray-100 dark:bg-gray-900 border-l-4 border-gray-500 dark:border-gray-700 text-gray-900 dark:text-gray-100',
  };

  const iconColors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    default: 'text-gray-600',
  };

  const color = colors[type] || colors.default;
  const iconColor = iconColors[type] || iconColors.default;

  return (
    <div
      className={`p-2 rounded-lg flex items-center transform transition-all duration-300 ease-in-out
        ${color} 
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
      `}
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-5 w-5 flex-shrink-0 mr-2 ${iconColor}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-xs font-semibold">
        {type.charAt(0).toUpperCase() + type.slice(1)} - {message}
      </p>
    </div>
  );
}
