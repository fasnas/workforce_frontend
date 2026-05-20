// UserProjects.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ArrowRight, Search, FolderOpen } from 'lucide-react';

const statusConfig = {
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border border-amber-200'  },
  ongoing:   { label: 'Ongoing',   classes: 'bg-blue-50 text-blue-700 border border-blue-200'     },
  completed: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
    <div className="h-4 bg-gray-100 rounded-full w-1/3" />
    <div className="h-5 bg-gray-200 rounded-full w-3/4" />
    <div className="h-3 bg-gray-100 rounded-full w-full" />
    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
    <div className="flex gap-2 pt-2">
      <div className="h-7 bg-gray-100 rounded-full w-24" />
    </div>
  </div>
);

const UserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const navigate = useNavigate();

  const getProjects = async () => {
    try {
      const response = await axiosInstance.get('/getallactiveprojects');
      setProjects(response.data.projects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getProjects(); }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const statusTabs = ['all', 'pending', 'ongoing', 'completed'];

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div>
        <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Labour Portal</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">My Projects</h1>
        <p className="text-sm text-gray-400 mt-1">Browse and track all your assigned projects</p>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300 font-medium"
          />
        </div>

        {/* Status filter — horizontal scroll on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide flex-shrink-0">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all cursor-pointer border
                ${filter === tab
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
                }`}
            >
              {tab === 'all' ? `All (${projects.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <FolderOpen size={48} strokeWidth={1.2} className="mb-3 text-gray-300" />
          <p className="font-semibold text-base text-gray-600">No projects found</p>
          <p className="text-sm mt-1">
            {search ? 'Try a different search term.' : 'No projects available right now.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const st = statusConfig[project.status] || statusConfig.pending;
            return (
              <div
                key={project._id}
                onClick={() => navigate(`/user/projects/${project._id}`)}
                className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col gap-3 active:scale-95"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.classes}`}>
                    {st.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                  {project.projectName}
                </h2>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mt-auto pt-1">
                  {project.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                      <MapPin size={11} className="text-gray-400" />
                      {project.location}
                    </span>
                  )}
                  {project.supervisor?.name && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                      <User size={11} className="text-gray-400" />
                      {project.supervisor.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserProjects;