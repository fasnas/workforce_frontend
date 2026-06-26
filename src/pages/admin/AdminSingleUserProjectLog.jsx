import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ClipboardList,
  CalendarDays,
  Timer,
  Loader2,
  AlertCircle,
  Briefcase,
  User,
  Mail,
  CalendarCheck,
  FileText,
  TrendingUp,
  FolderOpen,
  HardHat,
  UserCog,
  Shield,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────── */
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const fmtDateTime = (d) => {
  const date = new Date(d);
  return (
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) +
    ' · ' +
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );
};

const toYearMonth = (d) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const monthLabel = (ym) => {
  const [y, m] = ym.split('-');
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

/* ── role config ─────────────────────────────────── */
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

/* ── component ───────────────────────────────────── */
const AdminSingleUserProjectLog = () => {
  const { userId, projectId } = useParams();
  const navigate = useNavigate();

  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  /* filter state */
  const [filterMode, setFilterMode]       = useState('all');   // 'all' | 'month' | 'date'
  const [selectedMonth, setSelectedMonth] = useState('');      // 'YYYY-MM'
  const [selectedDate, setSelectedDate]   = useState('');      // 'YYYY-MM-DD'
  const [monthDropOpen, setMonthDropOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/singleuserworkedprojectwisetimelog/${userId}/${projectId}`
        );
        setData(res.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load time log');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, projectId]);

  /* derived: unique months from history */
  const availableMonths = useMemo(() => {
    if (!data?.history) return [];
    const set = new Set(data.history.map((l) => toYearMonth(l.workDate)));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [data]);

  /* derived: filtered rows */
  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];
    if (filterMode === 'month' && selectedMonth) {
      return data.history.filter(
        (l) => toYearMonth(l.workDate) === selectedMonth
      );
    }
    if (filterMode === 'date' && selectedDate) {
      return data.history.filter(
        (l) => l.workDate.slice(0, 10) === selectedDate
      );
    }
    return data.history;
  }, [data, filterMode, selectedMonth, selectedDate]);

  /* filtered hours total */
  const filteredHours = useMemo(
    () => filteredHistory.reduce((s, l) => s + (l.logHours || 0), 0),
    [filteredHistory]
  );

  /* ── loading / error ── */
  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );

  const { user, project, summary } = data;
  const role     = roleConfig[user.role] || roleConfig.labour;
  const RoleIcon = role.icon;

  const summaryStats = [
    {
      title: 'Total Sessions',
      value: summary.totalSessions ?? '—',
      icon: ClipboardList,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Hours',
      value: summary.totalWorkedHours != null ? `${summary.totalWorkedHours}h` : '—',
      icon: Clock,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'This Month',
      value: summary.thisMonthHours != null ? `${summary.thisMonthHours}h` : '—',
      icon: CalendarDays,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'This Week',
      value: summary.thisWeekHours != null ? `${summary.thisWeekHours}h` : '—',
      icon: TrendingUp,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Today',
      value: summary.todayHours != null ? `${summary.todayHours}h` : '—',
      icon: Timer,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const workerInfoRows = [
    { label: 'Name',         value: user.name,            icon: User      },
    { label: 'Email',        value: user.email,           icon: Mail      },
    {
      label: 'Role',
      icon: RoleIcon,
      custom: (
        <span
          className={`px-2 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${role.bg} ${role.text}`}
        >
          <RoleIcon size={11} />
          {role.label}
        </span>
      ),
    },
    { label: 'Project',      value: project.projectName,  icon: Briefcase },
  ];

  const clearFilter = () => {
    setFilterMode('all');
    setSelectedMonth('');
    setSelectedDate('');
  };

  const isFiltered = filterMode !== 'all';

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-1"
          >
            <ArrowLeft size={15} /> Back to User
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Project Time Log</h1>
          <p className="text-gray-600 mt-1">
            {project.projectName} — {user.name}
          </p>
        </div>
      </div>

      {/* ── Summary Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {summaryStats.map((stat) => {
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

      {/* ── Worker & Project Info Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Worker Info</p>
        </div>
        <table className="w-full">
          <tbody className="bg-white divide-y divide-gray-100">
            {workerInfoRows.map(({ label, value, icon: Icon, custom }) => (
              <tr key={label} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap w-48">
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <Icon size={15} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {custom ?? value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Work History Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Section header + filters */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">

          {/* Title row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Work History</h2>
              <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {filteredHistory.length}
                {isFiltered && ` / ${data.history.length}`}
              </span>
              {isFiltered && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {filteredHours}h filtered
                </span>
              )}
            </div>

            {/* Filter mode tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-400" />
              {['all', 'month', 'date'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setFilterMode(mode); setSelectedMonth(''); setSelectedDate(''); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    filterMode === mode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'all' ? 'All' : mode === 'month' ? 'By Month' : 'By Date'}
                </button>
              ))}
              {isFiltered && (
                <button
                  onClick={clearFilter}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Month dropdown */}
          {filterMode === 'month' && (
            <div className="relative w-full sm:w-64">
              <button
                onClick={() => setMonthDropOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
              >
                <span className={selectedMonth ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                  {selectedMonth ? monthLabel(selectedMonth) : 'Select a month…'}
                </span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${monthDropOpen ? 'rotate-180' : ''}`} />
              </button>
              {monthDropOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {availableMonths.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">No months available</p>
                  ) : (
                    availableMonths.map((ym) => (
                      <button
                        key={ym}
                        onClick={() => { setSelectedMonth(ym); setMonthDropOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          selectedMonth === ym ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {monthLabel(ym)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Date picker */}
          {filterMode === 'date' && (
            <div className="w-full sm:w-64">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {isFiltered ? 'No logs for this period' : 'No logs yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {isFiltered
                ? 'Try a different filter or clear to see all entries.'
                : 'No time entries have been recorded for this project.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Logged
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logged On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">

                    {/* Work Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <CalendarCheck size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{fmtDate(log.workDate)}</p>
                          <p className="text-xs text-gray-400">{log._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <Clock size={13} className="text-purple-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{log.logHours}h</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <FileText size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 truncate">
                          {log.description || (
                            <span className="text-gray-400 italic">No description</span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Logged On — date + time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {fmtDate(log.createdAt)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

              {/* Filtered total footer */}
              {isFiltered && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Period Total
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-purple-500" />
                        <span className="text-sm font-bold text-gray-900">{filteredHours}h</span>
                      </div>
                    </td>
                    <td colSpan={2} className="px-6 py-3 text-xs text-gray-400">
                      {filteredHistory.length} session{filteredHistory.length !== 1 ? 's' : ''}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminSingleUserProjectLog;