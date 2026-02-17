import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-md z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <MessageSquare className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800 text-lg">Flow Builder</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
