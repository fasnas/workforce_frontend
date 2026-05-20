// SupervisorOngoingProject.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, User, ArrowRight, Search,
  FolderOpen, Calendar, PlayCircle
} from 'lucide-react';

/* ─── Helpers ───────────────────────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ─── Skeleton ──────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-100 rounded-full w-1/4" />
        <div className="h-5 bg-gray-200 rounded-full w-3/4" />
      </div>
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </div>
    <div className="h-px bg-gray-100" />
    <div className="grid grid-cols-2 gap-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
          <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
        </div>
      ))}
    </div>
    <div className="flex justify-between items-center pt-1">
      <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      <div className="h-8 w-8 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

/* ─── Project Card ──────────────────────────────────────────────────── */
const ProjectCard = ({ project, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
      hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer
      active:scale-[0.98] flex flex-col gap-4"
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ongoing</p>
        </div>
        <h2 className="text-base font-extrabold text-gray-900 leading-snug line-clamp-2">
          {project.projectName}
        </h2>
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-50 border border-gray-100
        flex items-center justify-center
        group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-200">
        <ArrowRight size={14} className="text-gray-400 group-hover:text-white transition-colors duration-200" />
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-gray-100" />

    {/* Meta grid */}
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={11} className="text-indigo-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Client</p>
          <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{project.clientName}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MapPin size={11} className="text-rose-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Location</p>
          <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{project.location}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={11} className="text-violet-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Supervisor</p>
          <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
            {project.supervisor?.name || '—'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Calendar size={11} className="text-emerald-500" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Created</p>
          <p className="text-xs font-bold text-gray-800 mt-0.5">{fmt(project.createdAt)}</p>
        </div>
      </div>
    </div>

    {/* Description */}
    {project.description && (
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 border-t border-gray-100 pt-3">
        {project.description}
      </p>
    )}
  </div>
);

/* ─── Main ──────────────────────────────────────────────────────────── */
const SupervisorOngoingProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const navigate = useNavigate();

  const getAllProjects = async () => {
    try {
      const res = await axiosInstance.get('/getallactiveprojects');
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllProjects(); }, []);

  const filtered = projects.filter(p =>
    p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Supervisor Panel</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-0.5 leading-tight">
            Ongoing Projects
          </h1>
          <p className="text-sm text-gray-400 mt-1">All currently active projects</p>
        </div>

        {/* Active count pill */}
        {!loading && projects.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 self-start sm:self-auto flex-shrink-0">
            <PlayCircle size={14} className="text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">{projects.length} active</span>
          </div>
        )}
      </div>

      {/* ── Search ── */}
      {!loading && projects.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, client or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm font-medium bg-white border border-gray-200
              rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
              placeholder-gray-300 shadow-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FolderOpen size={28} strokeWidth={1.3} className="text-gray-300" />
          </div>
          <h2 className="text-base font-extrabold text-gray-800">
            {search ? 'No results found' : 'No Active Projects'}
          </h2>
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
            {search
              ? `No projects match "${search}". Try a different keyword.`
              : 'There are no ongoing projects at the moment.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-5 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="text-xs font-semibold text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => navigate(`/supervisor/ongoingprojects/${project._id}`)}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default SupervisorOngoingProject;