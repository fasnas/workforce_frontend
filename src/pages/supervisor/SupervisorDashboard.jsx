import React from "react";

const hints = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "New site investigation",
    desc: "Starting a field visit? Create a new project first, then log your time against it.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>
      </svg>
    ),
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    title: "Project survey",
    desc: "Running a survey on-site? Set up the project and track all hours from there.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Log time",
    desc: "Always log your hours under the correct project so nothing goes untracked.",
  },
];

const steps = [
  {
    num: "1",
    numBg: "bg-blue-50 text-blue-700",
    title: "Create a new project",
    desc: 'Go to Projects and tap "New project". Give it a clear name — for example "Site A investigation" or "Survey – Block 3". This becomes the container for all time and activity.',
    tag: "Projects → New project",
    tagStyle: "bg-blue-50 text-blue-700",
  },
  {
    num: "2",
    numBg: "bg-teal-50 text-teal-700",
    title: "Start your site work",
    desc: "Head to the site and begin the investigation or survey. Keep the project open on your device so you can log time as you go or right when you finish.",
    tag: "On-site activity",
    tagStyle: "bg-teal-50 text-teal-700",
  },
  {
    num: "3",
    numBg: "bg-amber-50 text-amber-700",
    title: "Log time on the project",
    desc: 'Open the project, tap "Log time", and enter the hours spent. Add a short note describing what was done — this helps with reporting and billing later.',
    tag: "Project → Log time",
    tagStyle: "bg-amber-50 text-amber-700",
  },
  {
    num: "4",
    numBg: "bg-gray-100 text-gray-600",
    title: "Repeat for each visit",
    desc: "Every return visit or new task should have its time logged separately. Use the same project if the work is ongoing, or create a new one for a different site.",
    tag: "Each visit = one log entry",
    tagStyle: "bg-gray-100 text-gray-600",
    last: true,
  },
];

const SupervisorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Here's how to get started with your work</p>
        </div>

        {/* Quick action hints */}
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">Quick actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {hints.map((h, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${h.iconBg} ${h.iconColor}`}>
                {h.icon}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{h.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 my-6" />

        {/* Steps + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Steps */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-4">How it works</p>
            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${s.numBg}`}>
                      {s.num}
                    </div>
                    {!s.last && <div className="w-px flex-1 min-h-6 bg-gray-100 mt-1" />}
                  </div>
                  <div className={`pb-6 ${s.last ? "pb-0" : ""}`}>
                    <p className="text-sm font-medium text-gray-900 mb-1 mt-0.5">{s.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{s.desc}</p>
                    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ${s.tagStyle}`}>
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1">Good to know</p>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 mb-1">Create before you go</p>
                <p className="text-xs text-gray-500 leading-relaxed">Always create the project before heading to site — you can log time immediately when done, even from your phone.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 mb-1">One entry per visit</p>
                <p className="text-xs text-gray-500 leading-relaxed">Log each site visit separately with a short note. This keeps your records clean for reporting.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 mb-1">Different site? New project</p>
                <p className="text-xs text-gray-500 leading-relaxed">Each physical location or investigation scope should be its own project for accurate tracking.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupervisorDashboard;