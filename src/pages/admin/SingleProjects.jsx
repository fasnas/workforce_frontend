import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/AxiosInstance';

/* ─── Utility ─────────────────────────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const toYMD = (d) => new Date(d).toISOString().slice(0, 10); // "2026-05-20"

/* ─── Sub-components ───────────────────────────────────────────────────── */

const StatCard = ({ label, value, colorClass, bgClass, icon }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
    <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 ${bgClass}`} />
    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
    <div className="flex items-end gap-1 mt-3">
      <span className={`text-4xl font-extrabold leading-none ${colorClass}`}>{value}</span>
      {label.toLowerCase().includes('hour') && (
        <span className="text-sm text-gray-400 font-medium mb-1">hrs</span>
      )}
    </div>
    <div className="absolute bottom-4 right-5 text-2xl opacity-10">{icon}</div>
  </div>
);

const InfoTile = ({ label, value, icon }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase m-0">{label}</p>
    </div>
    <h3 className="text-sm font-bold text-gray-800 mt-1">{value || '—'}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { dot: 'bg-orange-400', ring: 'ring-orange-200', text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', label: 'Pending',   pulse: false },
    ongoing:   { dot: 'bg-blue-400',   ring: 'ring-blue-200',   text: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     label: 'Ongoing',   pulse: true  },
    completed: { dot: 'bg-green-400',  ring: 'ring-green-200',  text: 'text-green-700',  bg: 'bg-green-50 border-green-200',   label: 'Completed', pulse: false },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ring-2 ${s.dot} ${s.ring} ${s.pulse ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
};

const LogRow = ({ log, maxHours }) => {
  const pct      = Math.min((log.logHours / maxHours) * 100, 100);
  const barClass = log.logHours >= 8 ? 'bg-emerald-500' : log.logHours >= 5 ? 'bg-blue-500' : 'bg-amber-400';
  const textClass= log.logHours >= 8 ? 'text-emerald-600' : log.logHours >= 5 ? 'text-blue-600' : 'text-amber-500';

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-gray-800 m-0">{fmt(log.workDate)}</p>
            {log.createdAt && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-md px-2 py-0.5 font-mono">
                🕐 {fmt(log.createdAt)}, {fmtTime(log.createdAt)}
              </span>
            )}
          </div>
          {log.userId && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {log.userId.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-gray-700">{log.userId.name}</span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-0.5 capitalize">
                {log.userId.role}
              </span>
            </div>
          )}
          {log.description && (
            <p className="text-xs text-gray-400 mt-1.5 truncate max-w-md">{log.description}</p>
          )}
        </div>
        <span className={`text-lg font-extrabold whitespace-nowrap font-mono ${textClass}`}>
          {log.logHours} <span className="text-xs font-medium text-gray-400">hrs</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const EmptyState = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <span className="text-5xl mb-3">{filtered ? '🔍' : '📭'}</span>
    <p className="font-semibold text-base">{filtered ? 'No logs for this date range' : 'No time logs yet'}</p>
    <p className="text-sm mt-1">{filtered ? 'Try adjusting the date filter.' : 'Logs will appear here once work is recorded.'}</p>
  </div>
);

/* ─── Mini Calendar Filter ─────────────────────────────────────────────── */
const CalendarFilter = ({ allLogs, dateFrom, dateTo, onFromChange, onToChange, onClear }) => {
  // Build a set of dates that have logs for dot indicators
  const logDates = useMemo(() => new Set(allLogs.map(l => toYMD(l.workDate))), [allLogs]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">📅</span>
          <h3 className="text-sm font-bold text-gray-800">Filter by Date</h3>
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors cursor-pointer"
          >
            ✕ Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* From */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            From
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={e => onFromChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* To */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            To
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={e => onToChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          { label: 'Today',      getDates: () => { const t = toYMD(new Date()); return [t, t]; } },
          { label: 'This Week',  getDates: () => {
            const now = new Date();
            const day = now.getDay();
            const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
            const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
            return [toYMD(mon), toYMD(sun)];
          }},
          { label: 'This Month', getDates: () => {
            const now = new Date();
            const first = new Date(now.getFullYear(), now.getMonth(), 1);
            const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return [toYMD(first), toYMD(last)];
          }},
          { label: 'Last Month', getDates: () => {
            const now = new Date();
            const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const last  = new Date(now.getFullYear(), now.getMonth(), 0);
            return [toYMD(first), toYMD(last)];
          }},
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => { const [f, t] = preset.getDates(); onFromChange(f); onToChange(t); }}
            className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Active filter summary */}
      {(dateFrom || dateTo) && (
        <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
          <span className="text-blue-500 text-sm">🔎</span>
          <p className="text-xs font-semibold text-blue-700 m-0">
            Showing logs
            {dateFrom && ` from ${fmt(dateFrom)}`}
            {dateTo   && ` to ${fmt(dateTo)}`}
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────── */

const SingleProjects = () => {
  const { id } = useParams();
  const [project,   setProject]   = useState(null);
  const [timeLogs,  setTimeLogs]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('chart');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFrom,  setDateFrom]  = useState('');
  const [dateTo,    setDateTo]    = useState('');

  const getProject = async () => {
    try { const r = await axiosInstance.get(`/project/${id}`); setProject(r.data.project); }
    catch (e) { console.log(e); }
  };

  const getTimeLogs = async () => {
    try { const r = await axiosInstance.get(`/gettimelogprojectwiseforadmin/${id}`); setTimeLogs(r.data.timeLogs); }
    catch (e) { console.log(e); }
  };

  useEffect(() => {
    (async () => { await Promise.all([getProject(), getTimeLogs()]); setLoading(false); })();
  }, [id]);

  /* ── Filtering ── */
  const filteredLogs = useMemo(() => {
    return timeLogs.filter(log => {
      const d = toYMD(log.workDate);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo   && d > dateTo)   return false;
      return true;
    });
  }, [timeLogs, dateFrom, dateTo]);

  const isFiltered = dateFrom || dateTo;

  /* ── Stats (based on filtered logs) ── */
  const displayLogs  = isFiltered ? filteredLogs : timeLogs;
  const totalHours   = displayLogs.reduce((acc, l) => acc + l.logHours, 0);
  const avgHours     = displayLogs.length > 0 ? (totalHours / displayLogs.length).toFixed(1) : 0;
  const maxHours     = Math.max(...displayLogs.map(l => l.logHours), 1);

  const sortedLogs = [...displayLogs].sort((a, b) => {
    const diff = new Date(a.workDate) - new Date(b.workDate);
    return sortOrder === 'asc' ? diff : -diff;
  });

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      {[180, 100, 80, 400].map((h, i) => (
        <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: h }} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-5 max-w-5xl mx-auto space-y-5">

      {/* ── HEADER CARD ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Project Overview</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              {project?.projectName}
            </h1>
            {project?.description && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">{project.description}</p>
            )}
          </div>
          <StatusBadge status={project?.status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <InfoTile label="Client"     value={project?.clientName}       icon="🏢" />
          <InfoTile label="Location"   value={project?.location}         icon="📍" />
          <InfoTile label="Supervisor" value={project?.supervisor?.name} icon="👤" />
          <InfoTile label="Created"    value={fmt(project?.createdAt)}   icon="📅" />
        </div>
      </div>

      {/* ── CALENDAR FILTER ── */}
      <CalendarFilter
        allLogs={timeLogs}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onFromChange={setDateFrom}
        onToChange={setDateTo}
        onClear={() => { setDateFrom(''); setDateTo(''); }}
      />

      {/* ── STAT CARDS (reflect filter) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Time Logs"    value={displayLogs.length} colorClass="text-blue-500"    bgClass="bg-blue-500"    icon="🗂️" />
        <StatCard label="Total Logged Hours" value={totalHours}          colorClass="text-emerald-500" bgClass="bg-emerald-500" icon="⏱️" />
        <StatCard label="Average Hours"      value={avgHours}            colorClass="text-purple-500"  bgClass="bg-purple-500"  icon="📊" />
      </div>

      {/* ── TABS CARD ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Tab bar */}
        <div className="flex items-center border-b border-gray-100 px-6 gap-1">
          {[
            { id: 'chart',   label: 'Hours Chart', icon: '📈' },
            { id: 'history', label: 'Log History',  icon: '🕒' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-4 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 bg-transparent cursor-pointer
                ${activeTab === tab.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === 'history' && displayLogs.length > 0 && (
                <span className="bg-gray-100 text-gray-500 text-xs font-bold rounded-full px-2 py-0.5">
                  {displayLogs.length}
                </span>
              )}
            </button>
          ))}

          {activeTab === 'history' && displayLogs.length > 0 && (
            <button
              onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
              className="ml-auto text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
            >
              {sortOrder === 'desc' ? '↓ Newest' : '↑ Oldest'}
            </button>
          )}
        </div>

        <div className="p-6">

          {/* Chart Tab */}
          {activeTab === 'chart' && (
            sortedLogs.length === 0 ? <EmptyState filtered={!!isFiltered} /> : (
              <div className="space-y-4">
                <div className="flex gap-5 mb-2">
                  {[
                    { label: '≥ 8 hrs', cls: 'bg-emerald-500' },
                    { label: '5–7 hrs', cls: 'bg-blue-500' },
                    { label: '< 5 hrs', cls: 'bg-amber-400' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${l.cls}`} />
                      <span className="text-xs font-semibold text-gray-400">{l.label}</span>
                    </div>
                  ))}
                </div>
                {sortedLogs.map((log) => {
                  const pct      = Math.min((log.logHours / maxHours) * 100, 100);
                  const barClass = log.logHours >= 8 ? 'bg-emerald-500' : log.logHours >= 5 ? 'bg-blue-500' : 'bg-amber-400';
                  const txtClass = log.logHours >= 8 ? 'text-emerald-600' : log.logHours >= 5 ? 'text-blue-600' : 'text-amber-500';
                  return (
                    <div key={log._id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-600">{fmt(log.workDate)}</span>
                        <span className={`text-xs font-bold font-mono ${txtClass}`}>{log.logHours} hrs</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            sortedLogs.length === 0 ? <EmptyState filtered={!!isFiltered} /> : (
              <div className="space-y-3">
                {sortedLogs.map((log, i) => (
                  <LogRow key={log._id} log={log} maxHours={maxHours} index={i} />
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default SingleProjects;  