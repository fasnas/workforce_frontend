// SupervisorSidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  ShoppingCart,
  Clock,
} from 'lucide-react';

const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/supervisor/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Create project',
      path: '/supervisor/addproject',
      icon: Package,
    },
    {
      name: 'All project',
      icon: Package,
      subItems: [
        { name: 'Potential Project', path: '/supervisor/potentialproject' },
        { name: 'Ongoing Project', path: '/supervisor/ongoingprojects' },
      ],
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      subItems: [
        { name: 'Manage Orders', path: '/supervisor/orders' },
        { name: 'Order History', path: '/supervisor/orders/history' },
      ],
    },
    {
      name: 'Reports',
      icon: BarChart3,
      subItems: [
        { name: 'Team Performance', path: '/supervisor/reports/performance' },
        { name: 'Sales Overview', path: '/supervisor/reports/sales' },
      ],
    },
    {
      name: 'Leave Requests',
      path: '/supervisor/leaves',
      icon: Clock,
    },
  ];

  const toggleDropdown = (menuName) => {
    if (openDropdown === menuName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menuName);
    }
  };

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold">Supervisor Panel</h1>
            <p className="text-xs text-gray-400 mt-1">Limited Access</p>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-gray-700 ${
                      sidebarOpen ? 'justify-between' : 'justify-center'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} />
                      {sidebarOpen && <span>{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  {sidebarOpen && openDropdown === item.name && (
                    <ul className="ml-9 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      sidebarOpen ? 'justify-start' : 'justify-center'
                    } space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span>{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SupervisorSidebar;