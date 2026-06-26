import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HardHat,
  UserCog,
  Shield,
  Mail,
  Phone,
  BadgeCheck,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ClipboardList,
  CalendarDays,
  Timer,
  Edit,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  User,
  FolderOpen,
} from 'lucide-react';

const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const roleConfig = {
  labour: {
    label: 'Labour',
    icon: HardHat,
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
  },
  supervisor: {
    label: 'Supervisor',
    icon: UserCog,
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-600',
  },
};

const statusConfig = {
  ongoing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Ongoing',
    dot: 'bg-blue-500',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Completed',
    dot: 'bg-green-500',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
    dot: 'bg-yellow-500',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelled',
    dot: 'bg-red-500',
  },
};

const AdminSingleUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [timelog, setTimelog]   = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, timeRes, projectRes] = await Promise.all([
          axiosInstance.get(`/gesingleuser/${id}`),
          axiosInstance.get(`/singleusertimelog/${id}`),
          axiosInstance.get(`/singleuserworkedprojectlist/${id}`),
        ]);
        setUser(userRes.data.user);
        setTimelog(timeRes.data);
        setProjects(projectRes.data.data || []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <Loader2 size={28} className="animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  const role     = roleConfig[user.role] || roleConfig.labour;
  const RoleIcon = role.icon;

  const timeStats = [
    {
      title: 'Total Logs',
      value: timelog?.totalTimeLogs ?? '—',
      icon: ClipboardList,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Hours',
      value: timelog?.totalHoursWorked != null ? `${timelog.totalHoursWorked}h` : '—',
      icon: Clock,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'This Month',
      value: timelog?.thisMonthHours != null ? `${timelog.thisMonthHours}h` : '—',
      icon: CalendarDays,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Today',
      value: timelog?.todayHours != null ? `${timelog.todayHours}h` : '—',
      icon: Timer,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const detailRows = [
    { label: 'Email',          value: user.email          || '—', icon: Mail       },
    { label: 'Phone',          value: user.phone          || '—', icon: Phone      },
    { label: 'Employee Code',  value: user.employeeCode   || '—', icon: BadgeCheck },
    {
      label: 'Monthly Salary',
      value: user.monthlySalary ? `₹${user.monthlySalary.toLocaleString()}` : '₹0',
      icon: DollarSign,
    },
    { label: 'Member Since',   value: fmt(user.createdAt), icon: Calendar },
    { label: 'Last Updated',   value: fmt(user.updatedAt), icon: Calendar },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-1"
          >
            <ArrowLeft size={15} /> Back to Users
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => navigate(`/admin/users/edit/${id}`)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Edit size={18} />
          <span>Edit User</span>
        </button>
      </div>

      {/* ── Time Log Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {timeStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={stat.textColor} size={22} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Profile + Details Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Profile header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`h-14 w-14 rounded-full ${role.iconBg} flex items-center justify-center flex-shrink-0`}>
              <RoleIcon size={26} className={role.iconText} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user._id?.slice(-8)}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${role.bg} ${role.text}`}>
                  <RoleIcon size={11} />
                  {role.label}
                </span>
                {user.isActive !== false ? (
                  <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <CheckCircle size={11} /> Active
                  </span>
                ) : (
                  <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    <XCircle size={11} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</p>
        </div>
        <table className="w-full">
          <tbody className="bg-white divide-y divide-gray-100">
            {detailRows.map(({ label, value, icon: Icon }) => (
              <tr key={label} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap w-48">
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <Icon size={15} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Worked Projects Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">Worked Projects</h2>
            <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
              {projects.length}
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500">This user hasn't been assigned to any projects.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => {
                  const st = statusConfig[project.status] || statusConfig.ongoing;
                  return (
                    <tr
                      key={project._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/users/${user._id}/${project._id}`)}
                    >
                      {/* Project name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Briefcase size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{project.projectName}</p>
                            <p className="text-xs text-gray-400">{project._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <User size={13} className="text-gray-400 flex-shrink-0" />
                          {project.clientName}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                          {project.location || '—'}
                        </div>
                      </td>

                      {/* Started */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fmt(project.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSingleUser;