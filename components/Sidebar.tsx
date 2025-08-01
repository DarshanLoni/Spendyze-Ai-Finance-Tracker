
import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, ListBulletIcon, PlusCircleIcon, BanknotesIcon, ArrowRightOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC<{ isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void; }> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login', { replace: true });
  };

  const navLinkClasses = 'flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200';
  const activeLinkClasses = 'bg-primary-500 text-white dark:bg-primary-600 dark:text-white shadow-lg';

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
        <Link to="/" onClick={closeSidebar} className="flex items-center space-x-2">
          <BanknotesIcon className="h-8 w-8 text-primary-500" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">Spendyze</span>
        </Link>
        <button className="md:hidden p-1 rounded-full text-gray-400 hover:text-gray-200" onClick={closeSidebar}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 space-y-2 mt-6">
        <NavLink to="/app/dashboard" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <HomeIcon className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/app/transactions" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ListBulletIcon className="h-6 w-6 mr-3" />
          Transactions
        </NavLink>
        <NavLink to="/app/add" onClick={closeSidebar} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
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
    </>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm p-4 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
