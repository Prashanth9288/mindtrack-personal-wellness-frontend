import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileMenu from './MobileMenu';
import AIAssistant from './AIAssistant';

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile menu */}
        <MobileMenu 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
