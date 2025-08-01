import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Header: React.FC<{ setIsSidebarOpen: (isOpen: boolean) => void }> = ({ setIsSidebarOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const getTitle = () => {
    const pathSegments = location.pathname.split('/');
    const path = pathSegments[2] || 'dashboard'; // /app/dashboard -> dashboard
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{getTitle()}</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
};

export default Header;