// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import {
//     Building2,
//     CheckCircle,
//     Clock,
//     Users,
//     UserCog,
//     HardHat,
//     Calendar as CalendarIcon,
//     TrendingUp,
//     TrendingDown,
//     Activity,
//     Briefcase,
//     FileText,
//     CheckSquare,
//     AlertCircle,
//     MoreVertical,
//     Download,
//     Upload,
//     ChevronRight
// } from 'lucide-react';

// const AdminDashboard = () => {
//     const [date, setDate] = useState(new Date());
//     const [stats, setStats] = useState({
//         totalProjects: 0,
//         activeProjects: 0,
//         completedProjects: 0,
//         totalUsers: 0,
//         supervisors: 0,
//         labourCount: 0,
//         pendingTasks: 0,
//         todayAttendance: 0
//     });

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     const fetchDashboardData = async () => {
//         // Mock data - Replace with API calls
//         setStats({
//             totalProjects: 24,
//             activeProjects: 15,
//             completedProjects: 9,
//             totalUsers: 156,
//             supervisors: 12,
//             labourCount: 98,
//             pendingTasks: 28,
//             todayAttendance: 87
//         });
//     };

//     const statCards = [
//         { title: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'bg-blue-500', bgColor: 'bg-blue-100', textColor: 'text-blue-600', change: '+12%', trend: 'up' },
//         { title: 'Active Projects', value: stats.activeProjects, icon: Building2, color: 'bg-green-500', bgColor: 'bg-green-100', textColor: 'text-green-600', change: '+5%', trend: 'up' },
//         { title: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle, color: 'bg-purple-500', bgColor: 'bg-purple-100', textColor: 'text-purple-600', change: '+8%', trend: 'up' },
//         { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-indigo-500', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600', change: '+15%', trend: 'up' },
//         { title: 'Supervisors', value: stats.supervisors, icon: UserCog, color: 'bg-yellow-500', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600', change: '+2', trend: 'up' },
//         { title: 'Labour Count', value: stats.labourCount, icon: HardHat, color: 'bg-orange-500', bgColor: 'bg-orange-100', textColor: 'text-orange-600', change: '+8', trend: 'up' },
//         { title: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'bg-red-500', bgColor: 'bg-red-100', textColor: 'text-red-600', change: '-3', trend: 'down' },
//         { title: 'Today Attendance', value: `${stats.todayAttendance}%`, icon: CalendarIcon, color: 'bg-teal-500', bgColor: 'bg-teal-100', textColor: 'text-teal-600', change: '+5%', trend: 'up' }
//     ];

//     const projects = [
//         { name: 'Mall Construction', progress: 65, status: 'active', deadline: '2024-03-15' },
//         { name: 'Road Extension', progress: 75, status: 'active', deadline: '2024-02-28' },
//         { name: 'Bridge Project', progress: 40, status: 'active', deadline: '2024-04-10' },
//         { name: 'Office Building', progress: 95, status: 'completing', deadline: '2024-01-30' },
//         { name: 'Residential Complex', progress: 30, status: 'active', deadline: '2024-05-20' }
//     ];

//     const recentActivities = [
//         { id: 1, action: 'New project "Mall Construction" created', user: 'Admin', time: '2 hours ago', type: 'project' },
//         { id: 2, action: 'John Doe marked attendance', user: 'Labour', time: '3 hours ago', type: 'attendance' },
//         { id: 3, action: 'Project "Road Extension" updated to 75%', user: 'Supervisor', time: '5 hours ago', type: 'progress' },
//         { id: 4, action: 'New supervisor assigned to "Bridge Project"', user: 'Admin', time: '1 day ago', type: 'assignment' }
//     ];

//     const upcomingTasks = [
//         { title: 'Site Inspection', time: 'Today, 2:00 PM', location: 'Mall Construction Site', priority: 'high' },
//         { title: 'Team Meeting', time: 'Tomorrow, 10:00 AM', location: 'Conference Room', priority: 'medium' },
//         { title: 'Monthly Report', time: 'Jan 25, 5:00 PM', location: 'Submit to management', priority: 'low' },
//         { title: 'Budget Review', time: 'Jan 26, 11:00 AM', location: 'Finance Department', priority: 'high' }
//     ];

//     const getActivityIcon = (type) => {
//         switch (type) {
//             case 'project': return <Briefcase size={16} className="text-blue-500" />;
//             case 'attendance': return <Users size={16} className="text-green-500" />;
//             case 'progress': return <Activity size={16} className="text-purple-500" />;
//             case 'assignment': return <UserCog size={16} className="text-yellow-500" />;
//             default: return <FileText size={16} className="text-gray-500" />;
//         }
//     };

//     const getPriorityStyles = (priority) => {
//         switch (priority) {
//             case 'high': return 'bg-red-100 text-red-700 border-red-200';
//             case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//             default: return 'bg-green-100 text-green-700 border-green-200';
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//                     <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects today.</p>
//                 </div>
//                 <div className="flex space-x-3">
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
//                         <Download size={18} />
//                         <span>Report</span>
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
//                         <Upload size={18} />
//                         <span>Export</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//                 {statCards.map((stat, index) => (
//                     <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
//                         <div className="flex items-center justify-between">
//                             <div className={`p-3 rounded-xl ${stat.bgColor}`}>
//                                 <stat.icon className={`${stat.textColor}`} size={22} />
//                             </div>
//                             <div className="flex items-center space-x-1">
//                                 {stat.trend === 'up' ? (
//                                     <TrendingUp size={14} className="text-green-500" />
//                                 ) : (
//                                     <TrendingDown size={14} className="text-red-500" />
//                                 )}
//                                 <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//                                     {stat.change}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="mt-4">
//                             <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
//                             <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
//                         </div>
//                         <div className="mt-4">
//                             <div className="w-full bg-gray-200 rounded-full h-1.5">
//                                 <div
//                                     className={`${stat.color} h-1.5 rounded-full transition-all duration-500`}
//                                     style={{ width: `${Math.min(100, (stat.value / 200) * 100)}%` }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Charts and Progress Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Attendance Overview */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
//                         <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                             <option>This Week</option>
//                             <option>This Month</option>
//                             <option>This Year</option>
//                         </select>
//                     </div>
//                     <div className="space-y-4">
//                         {[
//                             { day: 'Monday', present: 85, absent: 15 },
//                             { day: 'Tuesday', present: 88, absent: 12 },
//                             { day: 'Wednesday', present: 82, absent: 18 },
//                             { day: 'Thursday', present: 90, absent: 10 },
//                             { day: 'Friday', present: 87, absent: 13 }
//                         ].map((data, idx) => (
//                             <div key={idx}>
//                                 <div className="flex justify-between text-sm mb-1">
//                                     <span className="font-medium text-gray-700">{data.day}</span>
//                                     <div className="space-x-4">
//                                         <span className="text-green-600">Present: {data.present}%</span>
//                                         <span className="text-red-600">Absent: {data.absent}%</span>
//                                     </div>
//                                 </div>
//                                 <div className="flex space-x-1">
//                                     <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//                                         <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.present}%` }} />
//                                     </div>
//                                     <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//                                         <div className="bg-red-500 h-2 rounded-full" style={{ width: `${data.absent}%` }} />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Project Progress */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">Project Progress</h2>
//                         <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
//                     </div>
//                     <div className="space-y-5">
//                         {projects.map((project, index) => (
//                             <div key={index}>
//                                 <div className="flex justify-between mb-2">
//                                     <div className="flex-1">
//                                         <span className="text-sm font-medium text-gray-800">{project.name}</span>
//                                         <p className="text-xs text-gray-500 mt-0.5">Due: {project.deadline}</p>
//                                     </div>
//                                     <span className="text-sm font-semibold text-gray-700">{project.progress}%</span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                     <div
//                                         className={`h-2 rounded-full transition-all duration-500 ${project.progress >= 75 ? 'bg-green-500' :
//                                                 project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
//                                             }`}
//                                         style={{ width: `${project.progress}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Calendar and Tasks Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Calendar */}
//                 <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">Project Calendar</h2>
//                         <div className="flex space-x-2">
//                             <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                                 Month
//                             </button>
//                             <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                                 Week
//                             </button>
//                         </div>
//                     </div>

//                     {/* Custom Calendar Styling with Tailwind */}
//                     <div className="calendar-wrapper">
//                         <Calendar
//                             onChange={setDate}
//                             value={date}
//                             className="w-full border-0"
//                             tileClassName={({ date, view }) => {
//                                 if (view === 'month') {
//                                     const eventDates = ['2024-01-15', '2024-01-20', '2024-01-25'];
//                                     if (eventDates.includes(date.toISOString().split('T')[0])) {
//                                         return 'bg-blue-100 rounded-lg font-semibold';
//                                     }
//                                 }
//                                 return null;
//                             }}
//                         />
//                     </div>

//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                         <p className="text-sm font-medium text-gray-700 mb-3">Event Types</p>
//                         <div className="flex flex-wrap gap-4">
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                                 <span className="text-sm text-gray-600">Project Deadline</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                                 <span className="text-sm text-gray-600">Team Meeting</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                                 <span className="text-sm text-gray-600">Site Visit</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                                 <span className="text-sm text-gray-600">Report Submission</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Upcoming Tasks */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
//                         <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Task</button>
//                     </div>
//                     <div className="space-y-3">
//                         {upcomingTasks.map((task, index) => (
//                             <div key={index} className={`p-3 rounded-lg border ${getPriorityStyles(task.priority)} bg-opacity-50`}>
//                                 <div className="flex items-start justify-between">
//                                     <div className="flex-1">
//                                         <p className="text-sm font-semibold text-gray-900">{task.title}</p>
//                                         <p className="text-xs mt-1 opacity-75">{task.time}</p>
//                                         <p className="text-xs mt-0.5 opacity-75">{task.location}</p>
//                                     </div>
//                                     <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-semibold text-gray-900">Task Completion</p>
//                                     <p className="text-2xl font-bold text-blue-600 mt-1">68%</p>
//                                 </div>
//                                 <div className="w-16 h-16 relative">
//                                     <svg className="w-16 h-16 transform -rotate-90">
//                                         <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="4" fill="none" />
//                                         <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="4" fill="none"
//                                             strokeDasharray={`${2 * Math.PI * 28}`}
//                                             strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.68)}`}
//                                         />
//                                     </svg>
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-sm font-bold text-blue-600">68%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Activities and Attendance Summary */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Activities */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
//                         <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
//                     </div>
//                     <div className="space-y-4">
//                         {recentActivities.map((activity) => (
//                             <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
//                                 <div className="p-2 bg-gray-100 rounded-lg">
//                                     {getActivityIcon(activity.type)}
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
//                                     <div className="flex items-center space-x-2 mt-1">
//                                         <span className="text-xs text-gray-500">by {activity.user}</span>
//                                         <span className="text-xs text-gray-300">•</span>
//                                         <span className="text-xs text-gray-500">{activity.time}</span>
//                                     </div>
//                                 </div>
//                                 <button className="text-gray-400 hover:text-gray-600">
//                                     <MoreVertical size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Attendance Summary */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Attendance Summary</h2>
//                     <div className="flex flex-col items-center">
//                         <div className="relative w-48 h-48">
//                             <svg className="w-48 h-48 transform -rotate-90">
//                                 <circle cx="96" cy="96" r="88" stroke="#E5E7EB" strokeWidth="12" fill="none" />
//                                 <circle
//                                     cx="96"
//                                     cy="96"
//                                     r="88"
//                                     stroke="#10B981"
//                                     strokeWidth="12"
//                                     fill="none"
//                                     strokeDasharray={`${2 * Math.PI * 88}`}
//                                     strokeDashoffset={`${2 * Math.PI * 88 * (1 - stats.todayAttendance / 100)}`}
//                                     className="transition-all duration-500"
//                                 />
//                             </svg>
//                             <div className="absolute inset-0 flex flex-col items-center justify-center">
//                                 <span className="text-4xl font-bold text-gray-900">{stats.todayAttendance}%</span>
//                                 <span className="text-sm text-gray-600 mt-1">Attendance Rate</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 w-full mt-8">
//                             <div className="text-center p-4 bg-green-50 rounded-xl">
//                                 <p className="text-2xl font-bold text-green-600">
//                                     {Math.round((stats.todayAttendance / 100) * stats.labourCount)}
//                                 </p>
//                                 <p className="text-xs text-gray-600 mt-1">Present Today</p>
//                                 <div className="mt-2 h-1 bg-green-200 rounded-full">
//                                     <div className="h-1 bg-green-600 rounded-full" style={{ width: `${stats.todayAttendance}%` }} />
//                                 </div>
//                             </div>
//                             <div className="text-center p-4 bg-red-50 rounded-xl">
//                                 <p className="text-2xl font-bold text-red-600">
//                                     {stats.labourCount - Math.round((stats.todayAttendance / 100) * stats.labourCount)}
//                                 </p>
//                                 <p className="text-xs text-gray-600 mt-1">Absent Today</p>
//                                 <div className="mt-2 h-1 bg-red-200 rounded-full">
//                                     <div className="h-1 bg-red-600 rounded-full" style={{ width: `${100 - stats.todayAttendance}%` }} />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="w-full mt-6 pt-4 border-t border-gray-200">
//                             <div className="flex justify-between text-sm">
//                                 <span className="text-gray-600">Weekly Average</span>
//                                 <span className="font-semibold text-gray-900">86.5%</span>
//                             </div>
//                             <div className="mt-2 h-2 bg-gray-200 rounded-full">
//                                 <div className="h-2 bg-blue-500 rounded-full" style={{ width: '86.5%' }} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//         /* Calendar Custom Styles */
//         .calendar-wrapper .react-calendar {
//           border: none;
//           width: 100%;
//           font-family: inherit;
//         }
//         .calendar-wrapper .react-calendar__navigation {
//           margin-bottom: 1rem;
//         }
//         .calendar-wrapper .react-calendar__navigation button {
//           min-width: 40px;
//           background: none;
//           font-size: 1rem;
//           padding: 0.5rem;
//           border-radius: 0.5rem;
//         }
//         .calendar-wrapper .react-calendar__navigation button:enabled:hover,
//         .calendar-wrapper .react-calendar__navigation button:enabled:focus {
//           background-color: #F3F4F6;
//         }
//         .calendar-wrapper .react-calendar__month-view__weekdays {
//           text-transform: uppercase;
//           font-weight: 600;
//           font-size: 0.75rem;
//           color: #6B7280;
//           padding: 0.5rem;
//         }
//         .calendar-wrapper .react-calendar__tile {
//           padding: 0.75rem;
//           border-radius: 0.5rem;
//           transition: all 0.2s;
//         }
//         .calendar-wrapper .react-calendar__tile:enabled:hover,
//         .calendar-wrapper .react-calendar__tile:enabled:focus {
//           background-color: #F3F4F6;
//         }
//         .calendar-wrapper .react-calendar__tile--active {
//           background: #3B82F6 !important;
//           color: white !important;
//         }
//         .calendar-wrapper .react-calendar__tile--now {
//           background: #EFF6FF;
//         }
//         .calendar-wrapper .react-calendar__tile--now.react-calendar__tile--active {
//           background: #3B82F6 !important;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AdminDashboard;

import React from "react";

const dashboardData = {
  totalEmployees: 3,
  totalSupervisors: 1,
  totalUsers: 2,
  totalProjects: 3,
  activeProjects: 1,
  activePotentialProjects: 2,
  completedProjects: 0,
};

const StatCard = ({ icon, value, label, sub, iconBg, iconColor }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-base ${iconBg} ${iconColor}`}
    >
      {icon}
    </div>
    <div className="text-3xl font-semibold text-gray-900 dark:text-white font-mono leading-none mb-1">
      {value}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    {sub && (
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
        {sub}
      </div>
    )}
  </div>
);

const ProjectCard = ({ label, value, total, color, dotColor, barColor }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      </div>
      <div className="text-4xl font-semibold text-gray-900 dark:text-white font-mono leading-none">
        {value}
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        of {total} total projects
      </div>
      <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const RatioBar = ({ segments }) => (
  <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
    {segments.map((s, i) => (
      <div
        key={i}
        className={`rounded-sm transition-all duration-700 ${s.color}`}
        style={{ width: `${s.pct}%` }}
      />
    ))}
  </div>
);

const AdminDashboard = () => {
  const {
    totalEmployees,
    totalSupervisors,
    totalUsers,
    totalProjects,
    activeProjects,
    activePotentialProjects,
    completedProjects,
  } = dashboardData;

  const supPct = Math.round((totalSupervisors / totalEmployees) * 100);
  const userPct = Math.round((totalUsers / totalEmployees) * 100);
  const activePct = Math.round((activeProjects / totalProjects) * 100);
  const potentialPct = Math.round((activePotentialProjects / totalProjects) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Admin dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Overview of all people and projects
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </div>
        </div>

        {/* People section */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
          People
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            value={totalEmployees}
            label="Total employees"
            sub="All active members"
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            value={totalSupervisors}
            label="Supervisors"
            sub={`${supPct}% of employees`}
            iconBg="bg-violet-50 dark:bg-violet-950"
            iconColor="text-violet-600 dark:text-violet-400"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            value={totalUsers}
            label="Standard users"
            sub={`${userPct}% of employees`}
            iconBg="bg-teal-50 dark:bg-teal-950"
            iconColor="text-teal-600 dark:text-teal-400"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

        {/* Projects section */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
          Projects
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
            value={totalProjects}
            label="Total projects"
            sub="All time"
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            value={activeProjects}
            label="Active projects"
            sub="In progress"
            iconBg="bg-green-50 dark:bg-green-950"
            iconColor="text-green-600 dark:text-green-400"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>}
            value={activePotentialProjects}
            label="Potential projects"
            sub="Pending activation"
            iconBg="bg-orange-50 dark:bg-orange-950"
            iconColor="text-orange-500 dark:text-orange-400"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            value={completedProjects}
            label="Completed"
            sub="None completed yet"
            iconBg="bg-gray-100 dark:bg-gray-800"
            iconColor="text-gray-500 dark:text-gray-400"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

        

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              Team composition
            </div>
            <RatioBar
              segments={[
                { color: "bg-blue-400", pct: supPct },
                { color: "bg-teal-400", pct: userPct },
              ]}
            />
            <div className="flex gap-4 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Supervisors ({totalSupervisors})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Users ({totalUsers})
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Project status
            </div>
            <RatioBar
              segments={[
                { color: "bg-emerald-400", pct: activePct },
                { color: "bg-amber-400", pct: potentialPct },
                { color: "bg-gray-200 dark:bg-gray-700", pct: 0 },
              ]}
            />
            <div className="flex gap-4 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Active ({activeProjects})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Potential ({activePotentialProjects})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                Completed ({completedProjects})
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;