import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, Settings,
  ChevronDown, ChevronRight, X
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    icon: Users,
    subItems: [
      { name: 'All users',  path: '/admin/users'   },
      { name: 'Add user',   path: '/admin/adduser' },
    ],
  },
  {
    name: 'Projects',
    icon: Package,
    subItems: [
      { name: 'All projects', path: '/admin/allprojects' },
      { name: 'Add project',  path: '/admin/addproject'  },
    ],
  },
  
];

/* ── Single nav item ── */
const NavItem = ({ item, collapsed, openDropdown, toggle }) => {
  const location = useLocation();
  const isGroupActive = item.subItems?.some(s => location.pathname.startsWith(s.path));

  if (item.subItems) {
    const open = openDropdown === item.name;
    return (
      <li>
        <button
          onClick={() => toggle(item.name)}
          title={collapsed ? item.name : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
            ${isGroupActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
          <item.icon size={16} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {!collapsed && open && (
          <ul className="mt-1 ml-7 space-y-0.5 border-l border-white/10 pl-3">
            {item.subItems.map(sub => (
              <li key={sub.path}>
                <NavLink
                  to={sub.path}
                  className={({ isActive }) =>
                    `block px-2 py-1.5 text-xs rounded-md transition-colors
                    ${isActive ? 'text-white font-medium' : 'text-gray-500 hover:text-gray-300'}`
                  }
                >
                  {sub.name}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path}
        title={collapsed ? item.name : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
        }
      >
        <item.icon size={16} className="flex-shrink-0" />
        {!collapsed && <span>{item.name}</span>}
      </NavLink>
    </li>
  );
};

/* ── Sidebar ── */
const AdminSidebar = ({ sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const collapsed = !sidebarOpen;

  const toggle = (name) => setOpenDropdown(p => p === name ? null : name);

  const inner = (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-14 border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">Admin Panel</p>
            <p className="text-xs text-gray-500 leading-tight">Full access</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-0.5">
          {menuItems.map(item => (
            <NavItem
              key={item.name}
              item={item}
              collapsed={collapsed}
              openDropdown={openDropdown}
              toggle={toggle}
            />
          ))}
        </ul>
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden md:flex px-2 pb-4">
        <button
          onClick={() => setSidebarOpen(p => !p)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
        >
          <ChevronRight size={14} className={`transition-transform duration-200 flex-shrink-0 ${collapsed ? '' : 'rotate-180'}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden md:flex flex-col flex-shrink-0 h-full transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}>
        {inner}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-56 h-full z-50 flex flex-col shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md bg-white/10 text-white z-10"
            >
              <X size={14} />
            </button>
            {inner}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;