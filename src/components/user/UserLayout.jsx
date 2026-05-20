// UserLayout.jsx
import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import UserSidebar from './UserSidebar';
import { Outlet } from 'react-router-dom';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role="labour" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
            <Outlet />

          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;