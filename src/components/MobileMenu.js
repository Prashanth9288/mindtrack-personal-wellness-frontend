import React from 'react';
import { X, Home, Target, Heart, Trophy, BarChart3, Users, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Habits', href: '/habits', icon: Target },
    { name: 'Moods', href: '/moods', icon: Heart },
    { name: 'Goals', href: '/goals', icon: Trophy },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (!isOpen) return null;

  return (
    <div className="relative z-50 lg:hidden">
      <div className="fixed inset-0 z-50" />
      <div className="fixed inset-0 z-50 flex">
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type="button"
              className="-m-2.5 p-2.5"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">MindTrack</h1>
                </div>
              </div>
            </div>
            
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              isActive
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              window.location.pathname === item.href
                                ? 'text-primary-600'
                                : 'text-gray-400 group-hover:text-primary-600'
                            }`}
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                
                <li className="mt-auto">
                  <div className="flex items-center gap-x-4 px-2 py-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex w-full items-center gap-x-3 px-2 py-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Sign out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
