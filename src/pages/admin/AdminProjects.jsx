import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Briefcase, MapPin, User, Calendar,
  CheckCircle, Clock, Activity, ChevronLeft, ChevronRight,
  Trash2, AlertCircle, Loader2, X, Users
} from 'lucide-react';
import axiosInstance from '../../services/AxiosInstance';

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusMap = {
  pending:   { label: 'Potential', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  ongoing:   { label: 'Ongoing',   className: 'bg-blue-50 text-blue-700 border border-blue-200'   },
  completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border border-green-200' },
};

const ITEMS_PER_PAGE = 9;

/* ─── Stat Card ───────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
      <Icon size={16} className="text-gray-400" />
    </div>
  </div>
);

/* ─── Project Card ────────────────────────────────────────────────────── */
const ProjectCard = ({ project, navigate }) => {
  const st = statusMap[project.status] || { label: project.status, className: 'bg-gray-50 text-gray-600 border border-gray-200' };

  return (
    <div
      onClick={() => navigate(`/admin/allprojects/${project._id}`)}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 leading-snug flex-1">
          {project.projectName}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${st.className}`}>
          {st.label}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        {project.clientName && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User size={12} className="text-gray-300 flex-shrink-0" />
            <span className="truncate">{project.clientName}</span>
          </div>
        )}
        {project.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="text-gray-300 flex-shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
        )}
        {project.supervisor?.name && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Users size={12} className="text-gray-300 flex-shrink-0" />
            <span className="truncate">{project.supervisor.name}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={11} />
          {fmt(project.createdAt)}
        </div>
        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
          View →
        </span>
      </div>
    </div>
  );
};

/* ─── Delete Modal ────────────────────────────────────────────────────── */
const DeleteModal = ({ project, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
          <Trash2 size={16} className="text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Delete project</h3>
      </div>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        Are you sure you want to delete <span className="font-medium text-gray-700">{project?.projectName}</span>? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─── Skeleton ────────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="h-3.5 bg-gray-100 rounded w-2/3" />
      <div className="h-5 bg-gray-100 rounded-full w-16" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/5" />
    </div>
    <div className="h-3 bg-gray-100 rounded w-full mb-1" />
    <div className="h-3 bg-gray-100 rounded w-3/4 mb-4" />
    <div className="flex justify-between pt-3 border-t border-gray-100">
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="h-3 bg-gray-100 rounded w-10" />
    </div>
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────── */
const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects,        setProjects]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [statusFilter,    setStatusFilter]    = useState('all');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const r = await axiosInstance.get('/getallprojects');
      if (r.data.success) setProjects(r.data.projects);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await axiosInstance.delete(`/deleteproject/${selectedProject._id}`);
      await fetchProjects();
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (e) { console.error(e); }
  };

  /* Filtered + paginated */
  const filtered = projects.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      p.projectName?.toLowerCase().includes(q) ||
      p.clientName?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated    = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = {
    total:     projects.length,
    pending:   projects.filter(p => p.status === 'pending').length,
    ongoing:   projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const filterTabs = [
    { key: 'all',       label: 'All' },
    { key: 'pending',   label: 'Potential' },
    { key: 'ongoing',   label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-5 pb-8">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and track all construction projects</p>
        </div>
        <button
          onClick={() => navigate('/admin/addproject')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          New project
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"     value={stats.total}     icon={Briefcase}    />
        <StatCard label="Potential" value={stats.pending}   icon={Clock}        />
        <StatCard label="Ongoing"   value={stats.ongoing}   icon={Activity}     />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle}  />
      </div>

      {/* ── Search + filters ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, client, or location…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-9 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-300"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 flex-wrap">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setCurrentPage(1); }}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer
                  ${statusFilter === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-14 text-center">
          <Briefcase size={32} strokeWidth={1.2} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">No projects found</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first project.'}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/addproject')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer mx-auto"
            >
              <Plus size={14} />
              New project
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Count */}
          <p className="text-xs text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} projects
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(project => (
              <ProjectCard key={project._id} project={project} navigate={navigate} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft size={15} />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                const show = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                const ellipsis = (page === currentPage - 2 && currentPage > 3) || (page === currentPage + 2 && currentPage < totalPages - 2);
                if (ellipsis) return <span key={idx} className="text-xs text-gray-400 px-1">…</span>;
                if (!show) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors cursor-pointer
                      ${currentPage === page
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <DeleteModal
          project={selectedProject}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteModal(false); setSelectedProject(null); }}
        />
      )}
    </div>
  );
};

export default AdminProjects;