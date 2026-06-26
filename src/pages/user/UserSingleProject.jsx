// SingleProject.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/AxiosInstance';
import {
  MapPin, User, Calendar, Clock, Plus, X,
  CheckCircle, AlertCircle, Loader2, FileText,
  ChevronDown, Timer
} from 'lucide-react';

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const today     = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  ongoing: { label: 'Ongoing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400 animate-pulse' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
};

/* ─── Toast ────────────────────────────────────────────────────────────── */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const isError = toast.type === 'error';

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold
      ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}
    `}>
      {isError
        ? <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
        : <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
      }
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 cursor-pointer">
        <X size={16} />
      </button>
    </div>
  );
};

/* ─── Log Row ──────────────────────────────────────────────────────────── */
const LogRow = ({ log, index }) => {
  const [expanded, setExpanded] = useState(false);
  const hourColor = log.logHours >= 8 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : log.logHours >= 5 ? 'text-blue-600 bg-blue-50 border-blue-200'
      : 'text-amber-600 bg-amber-50 border-amber-200';

  return (
    <div
      className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:bg-white hover:shadow-sm transition-all duration-200"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="flex items-center justify-between px-4 py-3.5 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <Calendar size={14} className="text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800">{fmt(log.workDate)}</p>
            {log.createdAt && (
              <p className="text-xs text-gray-400 font-medium">
                Logged {fmtTime(log.createdAt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${hourColor}`}>
            {log.logHours} hrs
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Expanded description */}
      {expanded && log.description && (
        <div className="px-4 pb-3.5 pt-0 border-t border-gray-100">
          <div className="flex items-start gap-2 mt-2.5">
            <FileText size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">{log.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Modal ────────────────────────────────────────────────────────────── */

const LogTimeModal = ({ show, onClose, onSubmit, formData, onChange, submitting }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet — slides up on mobile, centered on desktop */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden">

        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Log Time</h2>
            <p className="text-xs text-gray-400 mt-0.5">Record your work hours</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-5 py-5 space-y-4">

{/* Work Date */}
<div>
  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
    Work Date
  </label>
  <div className="relative">
    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <input
      type="date"
      name="workDate"
      value={formData.workDate}
      onChange={onChange}
      min={yesterday()}
      max={today()}
      onKeyDown={(e) => e.preventDefault()}
      required
      className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
    />
  </div>
</div>

          {/* Log Hours */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Hours Worked
            </label>
            <div className="relative">
              <Timer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="number"
                name="logHours"
                value={formData.logHours}
                onChange={onChange}
                min="1"
                max="24"
                placeholder="e.g. 8"
                required
                className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              placeholder="What did you work on today?"
              required
              className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none placeholder-gray-300"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                : <><Clock size={15} /> Save Log</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main ─────────────────────────────────────────────────────────────── */
const SingleProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ workDate: '', logHours: '', description: '' });

  const getProject = async () => {
    try { const r = await axiosInstance.get(`/project/${id}`); setProject(r.data.project); }
    catch (e) { console.log(e); }
  };

  const getTimeLogs = async () => {
    try { const r = await axiosInstance.get(`/gettimelogprojectwise/${id}`); setTimeLogs(r.data.timeLogs); }
    catch (e) { console.log(e); }
  };

  useEffect(() => {
    (async () => { await Promise.all([getProject(), getTimeLogs()]); setLoading(false); })();
  }, [id]);

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/createtimelog', {
        projectId: id,
        logHours: Number(formData.logHours),
        workDate: formData.workDate,
        description: formData.description,
      });
      setToast({ type: 'success', message: 'Time log saved successfully!' });
      getTimeLogs();
      setShowModal(false);
      setFormData({ workDate: '', logHours: '', description: '' });
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  /* Loading skeleton */
  if (loading) return (
    <div className="space-y-5 p-1 animate-pulse">
      <div className="h-48 bg-gray-100 rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );

  const st = statusConfig[project?.status] || statusConfig.pending;
  const totalHours = timeLogs.reduce((a, l) => a + l.logHours, 0);
  const avgHours = timeLogs.length > 0 ? (totalHours / timeLogs.length).toFixed(1) : 0;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-5 pb-8">

        {/* ── Project Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">Project Details</p>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                {project?.projectName}
              </h1>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${st.bg} ${st.text} ${st.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>

          {project?.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {project.description}
            </p>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {project?.location && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Location</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{project.location}</p>
                </div>
              </div>
            )}
            {project?.supervisor?.name && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <User size={14} className="text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Supervisor</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{project.supervisor.name}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
              <Calendar size={14} className="text-indigo-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Created</p>
                <p className="text-xs font-bold text-gray-700">{fmt(project?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Log time CTA */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 cursor-pointer"
          >
            <Plus size={16} />
            Log Time
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Logs', value: timeLogs.length, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
            { label: 'Total Hours', value: `${totalHours}h`, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            // { label: 'Avg / Log',   value: `${avgHours}h`,  color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-100'  },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Time Log History ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Time Log History</h2>
              <p className="text-xs text-gray-400 mt-0.5">{timeLogs.length} entries recorded</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Clock size={15} className="text-indigo-500" />
            </div>
          </div>

          <div className="p-4">
            {timeLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Clock size={24} strokeWidth={1.3} className="text-gray-300" />
                </div>
                <p className="font-semibold text-sm text-gray-600">No logs yet</p>
                <p className="text-xs mt-1 text-center">Tap "Log Time" above to record your first entry.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...timeLogs]
                  .sort((a, b) => new Date(b.workDate) - new Date(a.workDate))
                  .map((log, i) => (
                    <LogRow key={log._id} log={log} index={i} />
                  ))
                }
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Modal ── */}
      <LogTimeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        submitting={submitting}
      />
    </>
  );
};

export default SingleProject;