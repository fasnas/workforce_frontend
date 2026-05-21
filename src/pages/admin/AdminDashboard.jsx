import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/AxiosInstance";

const StatCard = ({ icon, value, label, sub, iconBg, iconColor }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-base ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div className="text-3xl font-semibold text-gray-900 font-mono leading-none mb-1">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
    {sub && (
      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">{sub}</div>
    )}
  </div>
);

const ProjectCard = ({ label, value, total, dotColor, barColor }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">{label}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      </div>
      <div className="text-4xl font-semibold text-gray-900 font-mono leading-none">{value}</div>
      <div className="text-xs text-gray-400 mt-1">of {total} total projects</div>
      <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const RatioBar = ({ segments }) => (
  <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
    {segments.map((s, i) => (
      <div key={i} className={`rounded-sm transition-all duration-700 ${s.color}`} style={{ width: `${s.pct}%` }} />
    ))}
  </div>
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/getadmindashboarddata");
        setDashboard(res.data.dashboard);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-2xl p-6 text-center max-w-sm">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const {
    totalEmployees,
    totalSupervisors,
    totalUsers,
    totalProjects,
    activeProjects,
    activePotentialProjects,
    completedProjects,
  } = dashboard;

  const supPct = totalEmployees > 0 ? Math.round((totalSupervisors / totalEmployees) * 100) : 0;
  const userPct = totalEmployees > 0 ? Math.round((totalUsers / totalEmployees) * 100) : 0;
  const activePct = totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;
  const potentialPct = totalProjects > 0 ? Math.round((activePotentialProjects / totalProjects) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Admin dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Overview of all people and projects</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </div>
        </div>

        {/* People */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">People</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            value={totalEmployees} label="Total employees" sub="All active members"
            iconBg="bg-blue-50" iconColor="text-blue-600"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            value={totalSupervisors} label="Supervisors" sub={`${supPct}% of employees`}
            iconBg="bg-violet-50" iconColor="text-violet-600"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            value={totalUsers} label="Standard users" sub={`${userPct}% of employees`}
            iconBg="bg-teal-50" iconColor="text-teal-600"
          />
        </div>

        <div className="border-t border-gray-100 my-6" />

        {/* Projects */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Projects</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
            value={totalProjects} label="Total projects" sub="All time"
            iconBg="bg-amber-50" iconColor="text-amber-600"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            value={activeProjects} label="Active projects" sub="In progress"
            iconBg="bg-green-50" iconColor="text-green-600"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>}
            value={activePotentialProjects} label="Potential projects" sub="Pending activation"
            iconBg="bg-orange-50" iconColor="text-orange-500"
          />
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            value={completedProjects} label="Completed"
            sub={completedProjects === 0 ? "None completed yet" : `${completedProjects} finished`}
            iconBg="bg-gray-100" iconColor="text-gray-500"
          />
        </div>

        <div className="border-t border-gray-100 my-6" />

        {/* Breakdown */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Breakdown</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          <ProjectCard label="Active" value={activeProjects} total={totalProjects} dotColor="bg-emerald-500" barColor="bg-emerald-500" />
          <ProjectCard label="Potential" value={activePotentialProjects} total={totalProjects} dotColor="bg-amber-400" barColor="bg-amber-400" />
          <ProjectCard label="Completed" value={completedProjects} total={totalProjects} dotColor="bg-gray-300" barColor="bg-gray-300" />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              Team composition
            </div>
            <RatioBar segments={[{ color: "bg-blue-400", pct: supPct }, { color: "bg-teal-400", pct: userPct }]} />
            <div className="flex gap-4 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-400" />Supervisors ({totalSupervisors})</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-teal-400" />Users ({totalUsers})</div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Project status
            </div>
            <RatioBar segments={[{ color: "bg-emerald-400", pct: activePct }, { color: "bg-amber-400", pct: potentialPct }, { color: "bg-gray-200", pct: Math.max(0, 100 - activePct - potentialPct) }]} />
            <div className="flex gap-4 mt-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-emerald-400" />Active ({activeProjects})</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-amber-400" />Potential ({activePotentialProjects})</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-300" />Completed ({completedProjects})</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;