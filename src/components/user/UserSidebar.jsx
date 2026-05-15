// UserSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Heart,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Truck,
} from 'lucide-react';

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/user/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Orders',
      path: '/user/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Order History',
      path: '/user/orders/history',
      icon: Clock,
    },
    {
      name: 'Track Order',
      path: '/user/track-order',
      icon: Truck,
    },
    {
      name: 'Wishlist',
      path: '/user/wishlist',
      icon: Heart,
    },
    {
      name: 'Profile',
      path: '/user/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/user/settings',
      icon: Settings,
    },
  ];

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col border-r border-gray-200`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Customer Access</p>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${
                    sidebarOpen ? 'justify-start' : 'justify-center'
                  } space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`
                }
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;