// SupervisorPotentialProjectAdd.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Building2, User, MapPin, FileText,
  Briefcase, X, CheckCircle, AlertCircle,
  Info, Loader2, ArrowLeft
} from 'lucide-react';
import axiosInstance from '../../services/AxiosInstance';

/* ─── Toast ────────────────────────────────────────────────────────────── */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const isSuccess = toast.type === 'success';

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50
      flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold
      transition-all duration-300
      ${isSuccess
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {isSuccess
        ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" />
        : <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
      }
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 cursor-pointer flex-shrink-0">
        <X size={15} />
      </button>
    </div>
  );
};

/* ─── Field ─────────────────────────────────────────────────────────────── */
const Field = ({ label, icon: Icon, error, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <Icon size={16} />
      </div>
      {children}
    </div>
    {error  && <p className="text-xs font-semibold text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

/* ─── Main ─────────────────────────────────────────────────────────────── */
const SupervisorPotentialProjectAdd = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('user'));

  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [errors,    setErrors]    = useState({});
  const [formData,  setFormData]  = useState({
    projectName: '', clientName: '', location: '', description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.projectName.trim()) e.projectName = 'Project name is required';
    if (!formData.clientName.trim())  e.clientName  = 'Client name is required';
    if (!formData.location.trim())    e.location    = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axiosInstance.post('/addproject', {
        projectName: formData.projectName,
        clientName:  formData.clientName,
        location:    formData.location,
        description: formData.description,
        supervisor:  localUser._id,
        status:      'pending',
      });
      setToast({ type: 'success', message: `"${formData.projectName}" created successfully! Redirecting…` });
      setFormData({ projectName: '', clientName: '', location: '', description: '' });
      setTimeout(() => navigate('/supervisor/projects'), 2200);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border rounded-xl
     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
     transition-all placeholder-gray-300
     ${errors[field] ? 'border-red-300 bg-red-50 focus:ring-red-400' : 'border-gray-200'}`;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-2xl mx-auto space-y-5 pb-10">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/supervisor/projects')}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0 shadow-sm"
          >
            <ArrowLeft size={17} className="text-gray-500" />
          </button>
          <div>
            <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Supervisor Panel</p>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">Add New Project</h1>
          </div>
        </div>

        {/* ── Info Banner ── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={15} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">Before you submit</p>
            <ul className="mt-1.5 space-y-0.5">
              {[
                'Project goes to admin for approval',
                'Status starts as Pending by default',
                'You will be auto-assigned as supervisor',
              ].map(item => (
                <li key={item} className="text-xs text-indigo-700 flex items-start gap-1.5">
                  <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Briefcase size={17} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">Project Details</p>
              <p className="text-xs text-gray-400">Fill in all required fields marked with *</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-5 space-y-5">

              {/* Project Name */}
              <Field label="Project Name *" icon={Building2} error={errors.projectName}>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. Bridge Construction Phase 1"
                  className={inputClass('projectName')}
                />
              </Field>

              {/* Client Name */}
              <Field label="Client Name *" icon={User} error={errors.clientName}>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="e.g. Kerala Roads Authority"
                  className={inputClass('clientName')}
                />
              </Field>

              {/* Location */}
              <Field label="Location *" icon={MapPin} error={errors.location}>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kochi, Kerala"
                  className={inputClass('location')}
                />
              </Field>

              {/* Description */}
              <Field
                label="Description"
                icon={FileText}
                hint="Optional — briefly describe the scope of work."
              >
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the project scope, goals, and any key details…"
                  className="w-full pl-9 pr-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-gray-300 resize-none"
                  style={{ paddingTop: '0.75rem' }}
                />
              </Field>

              {/* Status pill */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Status: Pending</p>
                  <p className="text-xs text-amber-600 mt-0.5">Auto-set — admin will review and activate</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/supervisor/projects')}
                className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Creating…</>
                  : <><Plus size={16} /> Create Project</>
                }
              </button>
            </div>
          </form>
        </div>

      </div>
    </>
  );
};

export default SupervisorPotentialProjectAdd;