import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitBranch, Users, Settings, FileText } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/flows', label: 'Flows', icon: GitBranch },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                isActive
                  ? 'bg-green-50 text-green-600 border-l-4 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
              } flex items-center px-4 py-3 text-sm font-medium rounded-r transition-colors`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
