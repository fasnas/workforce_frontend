// SupervisorLayout.jsx
import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import SupervisorSidebar from './SupervisorSidebar';
import { Outlet } from 'react-router-dom';

const SupervisorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SupervisorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role="supervisor" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <div className="px-4 py-5 md:px-6 md:py-8 max-w-7xl mx-auto">
            {children}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupervisorLayout;