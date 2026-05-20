import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, LogOut, User } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

/* Derive a readable page title from the current path */
const getPageTitle = (pathname) => {
  const map = {
    '/admin/dashboard':   'Dashboard',
    '/admin/users':       'Users',
    '/admin/adduser':     'Add user',
    '/admin/allprojects': 'Projects',
    '/admin/addproject':  'Add project',
    '/admin/settings':    'Settings',
  };
  for (const [key, val] of Object.entries(map)) {
    if (pathname.startsWith(key)) return val;
  }
  return 'Admin';
};

/* ── Top Navbar ── */
const Topbar = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth?.() || {};
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
        >
          <Menu size={18} />
        </button>

        {/* Page title */}
        <h2 className="text-sm font-semibold text-gray-800 hidden sm:block">{title}</h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notification */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer">
          <Bell size={16} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(p => !p)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 hidden sm:block max-w-24 truncate">
              {user?.name || 'Admin'}
            </span>
            <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => { setUserMenuOpen(false); logout?.(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* ── Layout ── */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;