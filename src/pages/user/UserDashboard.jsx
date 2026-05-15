import React from 'react';
import { ShoppingBag, Truck, Package, Clock, Star, MapPin } from 'lucide-react';

const UserDashboard = () => {
  const recentOrders = [
    { id: '#12345', date: '2024-01-15', status: 'Delivered', total: '$129.99', items: 3 },
    { id: '#12346', date: '2024-01-10', status: 'Shipped', total: '$79.99', items: 2 },
    { id: '#12347', date: '2024-01-05', status: 'Processing', total: '$199.99', items: 4 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Track your orders and manage your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-3xl font-bold mt-2">24</p>
            </div>
            <ShoppingBag size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Transit</p>
              <p className="text-3xl font-bold mt-2">2</p>
            </div>
            <Truck size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Wishlist Items</p>
              <p className="text-3xl font-bold mt-2">8</p>
            </div>
            <Star size={40} className="opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Reviews</p>
              <p className="text-3xl font-bold mt-2">3</p>
            </div>
            <Package size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {order.total}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items} items
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              <span>Track Order</span>
              <Truck size={18} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
              <span>Shop Now</span>
              <ShoppingBag size={18} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
              <span>View Wishlist</span>
              <Star size={18} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
              <span>Update Address</span>
              <MapPin size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;