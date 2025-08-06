import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, ListBulletIcon, PlusCircleIcon, BanknotesIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinkClasses = 'flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200';
  const activeLinkClasses = 'bg-primary-500 text-white dark:bg-primary-600 dark:text-white shadow-lg';

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700">
      <Link to="/" className="flex items-center space-x-2 px-4 py-2">
        <BanknotesIcon className="h-8 w-8 text-primary-500" />
        <span className="text-2xl font-bold text-gray-800 dark:text-white">Spendyze</span>
      </Link>
      <nav className="flex-1 space-y-2 mt-6">
        <NavLink to="/app/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <HomeIcon className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/app/transactions" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ListBulletIcon className="h-6 w-6 mr-3" />
          Transactions
        </NavLink>
        <NavLink to="/app/add" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <PlusCircleIcon className="h-6 w-6 mr-3" />
          Add / Scan
        </NavLink>
      </nav>
      <div className="mt-auto">
         <button
            onClick={handleLogout}
            className={`${navLinkClasses} w-full`}
        >
            <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
            Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;