// import React from 'react';
// import { Users, Package, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react';

// const SupervisorDashboard = () => {
//   const stats = [
//     { title: 'Team Members', value: '12', icon: Users, change: '+2', color: 'bg-green-500' },
//     { title: 'Pending Products', value: '23', icon: Package, change: '5 new', color: 'bg-yellow-500' },
//     { title: "Today's Orders", value: '45', icon: ShoppingCart, change: '+8', color: 'bg-blue-500' },
//     { title: 'Team Performance', value: '94%', icon: TrendingUp, change: '+5%', color: 'bg-purple-500' },
//   ];

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Supervisor Dashboard</h1>
//         <p className="text-gray-600 mt-1">Monitor team performance and pending approvals.</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 <p className="text-sm text-green-600 mt-2">{stat.change} from yesterday</p>
//               </div>
//               <div className={`${stat.color} p-3 rounded-full`}>
//                 <stat.icon className="text-white" size={24} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h2>
//           <div className="space-y-4">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="flex items-center justify-between border-b pb-3">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Product Approval #{item}</p>
//                   <p className="text-xs text-gray-500">Submitted by John Doe</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded">Approve</button>
//                   <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded">Reject</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h2>
//           <div className="space-y-4">
//             {[
//               { name: 'Alice Johnson', task: 'Completed 5 orders', time: '10 mins ago' },
//               { name: 'Bob Smith', task: 'Updated products', time: '25 mins ago' },
//               { name: 'Carol White', task: 'Resolved 3 issues', time: '1 hour ago' },
//             ].map((activity, idx) => (
//               <div key={idx} className="flex items-center justify-between border-b pb-3">
//                 <div className="flex items-center space-x-3">
//                   <CheckCircle size={20} className="text-green-500" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{activity.name}</p>
//                     <p className="text-xs text-gray-500">{activity.task}</p>
//                   </div>
//                 </div>
//                 <Clock size={16} className="text-gray-400" />
//                 <span className="text-xs text-gray-500">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorDashboard;

import React from 'react'

const SupervisorDashboard = () => {
  return (
    <div>SupervisorDashboard</div>
  )
}

export default SupervisorDashboard