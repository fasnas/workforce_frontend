// SupervisorSidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  X,
  Layers,
  PlayCircle,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/supervisor/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Create Project',
    path: '/supervisor/addproject',
    icon: FolderPlus,
  },
  {
    name: 'All Projects',
    icon: FolderKanban,
    subItems: [
      { name: 'Potential Projects', path: '/supervisor/potentialproject', icon: Layers },
      { name: 'Ongoing Projects',   path: '/supervisor/ongoingprojects',  icon: PlayCircle },
    ],
  },
  {
    name: 'Leave Requests',
    path: '/supervisor/leaves',
    icon: Clock,
  },
];

const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(() => {
    // Auto-open dropdown if a sub-route is active on mount
    for (const item of menuItems) {
      if (item.subItems?.some(s => location.pathname.startsWith(s.path))) {
        return item.name;
      }
    }
    return null;
  });

  const toggleDropdown = (name) =>
    setOpenDropdown(prev => (prev === name ? null : name));

  const isSubActive = (item) =>
    item.subItems?.some(s => location.pathname.startsWith(s.path));

  const localUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  return (
    <aside
      className={`
        h-full bg-gray-900 text-white flex flex-col
        transition-all duration-300 shadow-2xl
        ${sidebarOpen ? 'w-64' : 'w-64 lg:w-20'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700/60">
        <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 lg:opacity-0'}`}>
          <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Supervisor</p>
          <h1 className="text-base font-extrabold text-white whitespace-nowrap leading-tight">Control Panel</h1>
        </div>
        {/* Mobile: X to close | Desktop: chevron to collapse */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex-shrink-0 cursor-pointer"
        >
          <span className="lg:hidden"><X size={19} /></span>
          <span className="hidden lg:block">
            {sidebarOpen ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        <ul className="space-y-0.5 px-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                /* ── Dropdown group ── */
                <div>
                  <button
                    onClick={() => {
                      // On collapsed desktop: expand sidebar first
                      if (!sidebarOpen && window.innerWidth >= 1024) {
                        setSidebarOpen(true);
                      }
                      toggleDropdown(item.name);
                    }}
                    className={`w-full flex items-center px-3 py-3 rounded-xl transition-all cursor-pointer
                      ${sidebarOpen ? 'justify-between' : 'lg:justify-center'}
                      ${isSubActive(item)
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-gray-400 hover:bg-gray-700/60 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={19} strokeWidth={isSubActive(item) ? 2.2 : 1.8} className="flex-shrink-0" />
                      <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden
                        ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 lg:hidden'}`}>
                        {item.name}
                      </span>
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 flex-shrink-0 ${openDropdown === item.name ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Sub-items */}
                  {sidebarOpen && openDropdown === item.name && (
                    <ul className="mt-1 ml-4 pl-3 border-l border-gray-700/60 space-y-0.5">
                      {item.subItems.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all
                              ${isActive
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-gray-400 hover:bg-gray-700/60 hover:text-white'
                              }`
                            }
                          >
                            <sub.icon size={15} className="flex-shrink-0" />
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                /* ── Direct link ── */
                <NavLink
                  to={item.path}
                  onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                    ${sidebarOpen ? '' : 'lg:justify-center'}
                    ${isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-gray-400 hover:bg-gray-700/60 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={19} strokeWidth={isActive ? 2.2 : 1.8} className="flex-shrink-0" />
                      <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                        ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 lg:hidden'}`}>
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className={`px-4 py-4 border-t border-gray-700/60 ${sidebarOpen ? '' : 'lg:px-3'}`}>
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'lg:justify-center'}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
            {localUser?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className={`overflow-hidden transition-all duration-300 min-w-0 ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 lg:hidden'}`}>
            <p className="text-xs font-bold text-white whitespace-nowrap leading-tight truncate">
              {localUser?.name || 'Supervisor'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{localUser?.role || 'supervisor'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SupervisorSidebar;