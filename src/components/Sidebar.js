import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Target, 
  Heart, 
  Trophy, 
  BarChart3, 
  Users, 
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from './Layout';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Habits', href: '/habits', icon: Target },
    { name: 'Moods', href: '/moods', icon: Heart },
    { name: 'Goals', href: '/goals', icon: Trophy },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${
      sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
    }`}>
      <div className="flex flex-grow flex-col overflow-y-auto bg-white border-r border-gray-200">
        {/* Header */}
        <div className={`flex flex-shrink-0 items-center py-4 ${
          sidebarCollapsed ? 'px-2 justify-between' : 'px-6'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1">
                <h1 className="text-xl font-bold text-gray-900">MindTrack</h1>
                <p className="text-sm text-gray-500">Wellness Tracker</p>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Positioned separately to avoid overlap */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-grow flex-col">
          <nav className={`flex-1 space-y-1 py-4 ${
            sidebarCollapsed ? 'px-2' : 'px-2'
          }`}>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center text-sm font-medium rounded-md transition-colors ${
                    sidebarCollapsed 
                      ? 'px-3 py-3 justify-center' 
                      : 'px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    sidebarCollapsed ? '' : 'mr-3'
                  } ${
                    window.location.pathname === item.href
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!sidebarCollapsed && item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* User Section */}
          <div className={`flex-shrink-0 border-t border-gray-200 ${
            sidebarCollapsed ? 'p-2' : 'p-4'
          }`}>
            <div className={`flex items-center ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}>
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={logout}
              className={`mt-3 flex items-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors ${
                sidebarCollapsed 
                  ? 'px-2 py-2 justify-center w-full' 
                  : 'px-2 py-2 w-full'
              }`}
              title={sidebarCollapsed ? 'Sign out' : undefined}
            >
              <LogOut className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
