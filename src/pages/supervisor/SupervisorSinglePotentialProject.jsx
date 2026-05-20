import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/AxiosInstance';
import {
  MapPin, User, Calendar, Clock, Plus, X,
  CheckCircle, AlertCircle, Loader2, FileText,
  ChevronDown, Timer
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const fmt     = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
const today   = () => new Date().toISOString().split('T')[0];

const statusStyles = {
  pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  ongoing:   { label: 'Ongoing',   className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border border-green-200' },
};

/* ─── Toast ───────────────────────────────────────────────────────────── */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 flex items-start gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-md
      ${isError ? 'bg-white border-red-200 text-red-600' : 'bg-white border-green-200 text-green-700'}`}>
      {isError
        ? <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
        : <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />}
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-40 hover:opacity-70 cursor-pointer"><X size={15} /></button>
    </div>
  );
};

/* ─── Stat Card ───────────────────────────────────────────────────────── */
const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

/* ─── Meta Item ───────────────────────────────────────────────────────── */
const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

/* ─── Log Row ─────────────────────────────────────────────────────────── */
const LogRow = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const workerName = log.worker?.name || log.user?.name || null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-sm font-medium text-gray-800">{fmt(log.workDate)}</div>
          {workerName && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <User size={11} />
              {workerName}
            </span>
          )}
          {log.createdAt && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              · {fmtTime(log.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">{log.logHours}h</span>
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && log.description && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <div className="flex items-start gap-2">
            <FileText size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-relaxed">{log.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Log Time Modal ──────────────────────────────────────────────────── */
const LogTimeModal = ({ show, onClose, onSubmit, formData, onChange, submitting }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-xl border border-gray-200 z-10 shadow-xl overflow-hidden">

        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Log time</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-5 py-5 space-y-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Work date</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                name="workDate"
                value={formData.workDate}
                onChange={onChange}
                max={today()}
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Hours worked</label>
            <div className="relative">
              <Timer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="number"
                name="logHours"
                value={formData.logHours}
                onChange={onChange}
                min="1"
                max="24"
                placeholder="0"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[2, 4, 6, 8].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onChange({ target: { name: 'logHours', value: h } })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer
                    ${Number(formData.logHours) === h
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              placeholder="What did you work on?"
              required
              className="w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none placeholder-gray-300"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? <><Loader2 size={14} className="animate-spin" /> Saving</>
                : 'Save log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main ────────────────────────────────────────────────────────────── */
const SupervisorSinglePotentialProject = () => {
  const { id } = useParams();
  const [project,    setProject]    = useState(null);
  const [timeLogs,   setTimeLogs]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [formData,   setFormData]   = useState({ workDate: '', logHours: '', description: '' });

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
      setToast({ type: 'success', message: 'Time log saved successfully.' });
      getTimeLogs();
      setShowModal(false);
      setFormData({ workDate: '', logHours: '', description: '' });
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-44 bg-gray-100 rounded-lg" />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg" />)}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>
  );

  const st         = statusStyles[project?.status] || statusStyles.pending;
  const totalHours = timeLogs.reduce((a, l) => a + l.logHours, 0);
  const uniqueDays = new Set(timeLogs.map(l => l.workDate?.split('T')[0])).size;
  const avgPerDay  = uniqueDays > 0 ? (totalHours / uniqueDays).toFixed(1) : '—';

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-4 pb-8">

        {/* ── Project header ── */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{project?.projectName}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.className}`}>
              {st.label}
            </span>
          </div>

          {project?.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-4">
              {project.description}
            </p>
          )}

          <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-gray-100">
            {project?.location && (
              <MetaItem icon={MapPin} label="Location" value={project.location} />
            )}
            {project?.supervisor?.name && (
              <MetaItem icon={User} label="Supervisor" value={project.supervisor.name} />
            )}
            <MetaItem icon={Calendar} label="Created" value={fmt(project?.createdAt)} />
          </div>

          <div className="mt-5">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={15} />
              Log time
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total logs"  value={timeLogs.length} />
          <StatCard label="Total hours" value={`${totalHours}h`} />
          <StatCard label="Avg / day"   value={`${avgPerDay}h`} />
        </div>

        {/* ── Time log history ── */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Time log history</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {timeLogs.length} {timeLogs.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
            <Clock size={15} className="text-gray-400" />
          </div>

          <div className="p-4">
            {timeLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={28} strokeWidth={1.2} className="text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">No entries yet</p>
                <p className="text-xs text-gray-400 mt-1">Use "Log time" above to add the first entry.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...timeLogs]
                  .sort((a, b) => new Date(b.workDate) - new Date(a.workDate))
                  .map((log) => <LogRow key={log._id} log={log} />)}
              </div>
            )}
          </div>
        </div>

      </div>

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

export default SupervisorSinglePotentialProject;