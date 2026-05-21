// UserSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, X, ChevronLeft, ChevronRight } from 'lucide-react';

const menuItems = [
  // { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { name: 'Projects',  path: '/user/projects',  icon: FolderKanban    },
];

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`
        h-full bg-white border-r border-gray-100 shadow-xl lg:shadow-sm
        flex flex-col transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-64 lg:w-20'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 lg:opacity-0'}`}>
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Labour</p>
          <h1 className="text-lg font-extrabold text-gray-900 leading-tight whitespace-nowrap">My Panel</h1>
        </div>

        {/* Close on mobile / toggle on desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 flex-shrink-0"
        >
          {/* Mobile: always show X when drawer is open */}
          <span className="lg:hidden"><X size={20} /></span>
          {/* Desktop: show chevron */}
          <span className="hidden lg:block">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => {
                  // close drawer on mobile after tap
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group
                  ${sidebarOpen ? '' : 'lg:justify-center'}
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? 'text-indigo-600' : ''}`}>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    </span>
                    <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                      ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 lg:hidden'}
                    `}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-gray-100 ${sidebarOpen ? '' : 'lg:px-3'}`}>
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'lg:justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            U
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 lg:hidden'}`}>
            <p className="text-xs font-bold text-gray-800 whitespace-nowrap leading-tight">Labour User</p>
            <p className="text-xs text-gray-400 whitespace-nowrap">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;