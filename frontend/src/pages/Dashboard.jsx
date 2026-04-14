import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Bookmark, Briefcase, Calendar, ChevronRight, Bell, ClipboardList,
  ExternalLink, Plus, Send, Sparkles, Star, Upload, UserCheck, UserPen, Users,
  Video, Eye, Download, Search, CheckCircle, Clock, Check, X, MapPin, DollarSign, Target, Award,
  KanbanSquare, MoreVertical, PlusCircle, Activity, UserPlus, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../state/AuthContext.jsx";
import { api } from "../utils/api.js";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function profileCompletionPercent(user) {
  if (!user) return 0;
  const checks = [
    Boolean(user.name?.trim()?.length > 1),
    Array.isArray(user.skills) && user.skills.length > 0,
    Boolean(user.qualification?.trim()),
    Boolean(user.preferredCategory?.trim()),
    Boolean(user.resume?.url),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function StatCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <div
      className={[
        "glass-card hover-card-effect group relative overflow-hidden p-5",
      ].join(" ")}
    >
      <div
        className={[
          "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition group-hover:scale-105",
          accent,
        ].join(" ")}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <div className="text-3xl font-semibold tracking-tight text-[var(--text-main)] tabular-nums">{value}</div>
      <div className="mt-1 text-small font-medium text-[var(--text-muted)]">{label}</div>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, subtitle, primary }) {
  const inner = (
    <>
      <span
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          primary
            ? "bg-primary text-white shadow-md shadow-primary/25"
            : "bg-slate-100 text-primary group-hover:bg-primary/10",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-small font-semibold text-[var(--text-main)]">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </>
  );

  const className = [
    "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition duration-300",
    primary
      ? "border-primary/30 bg-gradient-to-br from-primary/[0.06] to-indigo-500/[0.04] shadow-sm hover:border-primary/50 hover:shadow-md"
      : "border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-primary/25 hover:shadow-card",
  ].join(" ");

  return (
    <Link to={to} className={className}>
      {inner}
    </Link>
  );
}

function PipelineStep({ label, count, accent }) {
  return (
    <div
      className={[
        "flex min-w-[5.5rem] flex-1 flex-col items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-4 text-center shadow-sm transition duration-300",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:min-w-[6.5rem]",
      ].join(" ")}
    >
      <div className={`text-2xl font-bold tabular-nums ${accent}`}>{count}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

const PIPELINE_DATA = [
  { name: 'Jan', applicants: 400, interviews: 240, hired: 20 },
  { name: 'Feb', applicants: 300, interviews: 139, hired: 25 },
  { name: 'Mar', applicants: 200, interviews: 180, hired: 35 },
  { name: 'Apr', applicants: 278, interviews: 190, hired: 40 },
  { name: 'May', applicants: 189, interviews: 100, hired: 10 },
  { name: 'Jun', applicants: 239, interviews: 110, hired: 50 },
  { name: 'Jul', applicants: 349, interviews: 130, hired: 60 },
];

const RECRUITER_NOTIFICATIONS = [
  { id: 1, text: "Sarah Connor applied for Frontend Engineer", time: "2 mins ago", type: "apply" },
  { id: 2, text: "Interview scheduled with John Doe", time: "1 hour ago", type: "interview" },
  { id: 3, text: "Emily Chen accepted your job offer!", time: "2 hours ago", type: "offer" }
];

function RecruiterDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kanbanFilter, setKanbanFilter] = useState("all");

  const [kanbanCandidates, setKanbanCandidates] = useState([
     { id: 1, name: "Sarah Connor", role: "Frontend Engineer", stage: "Applied", avatar: "https://ui-avatars.com/api/?name=Sarah+Connor&background=random" },
     { id: 2, name: "John Doe", role: "React Developer", stage: "Interview", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random" },
     { id: 3, name: "Emily Chen", role: "UI Designer", stage: "Offer", avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=random" },
     { id: 4, name: "Michael Smith", role: "Backend Lead", stage: "Screening", avatar: "https://ui-avatars.com/api/?name=Michael+Smith&background=random" },
     { id: 5, name: "David Kim", role: "Data Scientist", stage: "Applied", avatar: "https://ui-avatars.com/api/?name=David+Kim&background=random" },
     { id: 6, name: "Jessica Alba", role: "Product Manager", stage: "Hired", avatar: "https://ui-avatars.com/api/?name=Jessica+Alba&background=random" }
  ]);

  const kanbanStages = ["Applied", "Screening", "Interview", "Offer", "Hired"];

  const load = () => {
    setLoading(true);
    api.get("/recruiter/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const firstName = (user?.name || "Recruiter").split(" ")[0];
  const stats = data?.stats;
  const jobs = data?.jobs || [];
  const recent = data?.recentApplications || [];

  const onDragStart = (e, candId) => {
     e.dataTransfer.setData("candId", candId);
  }
  const onDrop = (e, stage) => {
     e.preventDefault();
     const candId = parseInt(e.dataTransfer.getData("candId"));
     setKanbanCandidates(prev => prev.map(c => c.id === candId ? { ...c, stage } : c));
     toast.success(`Candidate moved to ${stage}`);
  }
  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="min-h-screen p-4 py-8 md:p-8">
      <div className="mx-auto max-w-[1400px]">
        {/* TOP HERO BANNER */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card-bg)]/80 backdrop-blur-xl border border-white/60 p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none"></div>
          <div className="relative z-10 w-full md:w-auto text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-2 tracking-tight">
              Welcome back, <span className="text-indigo-600">{firstName}</span>
            </h1>
            <p className="text-[var(--text-muted)] font-medium">Here's what's happening with your hiring pipelines today.</p>
          </div>
          <div className="flex gap-4 items-center shrink-0 w-full md:w-auto justify-center md:justify-end relative z-10">
             <Link to="/recruiter/jobs/new" className="flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-2xl font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                <PlusCircle className="h-5 w-5" /> Post New Job
             </Link>
          </div>
        </div>

        {/* 5 KPI STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Briefcase} label="Active Jobs" value={loading ? "—" : stats?.activeJobs ?? 3} hint="" accent="from-sky-500 to-blue-600 text-white" />
          <StatCard icon={Users} label="Total Applicants" value={loading ? "—" : stats?.totalApplicants ?? 142} hint="" accent="from-indigo-500 to-violet-600 text-white" />
          <StatCard icon={Calendar} label="Scheduled Interviews" value={loading ? "—" : stats?.interviewsScheduled ?? 12} hint="" accent="from-violet-500 to-purple-600 text-white" />
          <StatCard icon={UserCheck} label="Candidates Hired" value={loading ? "—" : stats?.hiredCandidates ?? 5} hint="" accent="from-emerald-500 to-teal-600 text-white" />
          <StatCard icon={Target} label="Offer Acceptance Rate" value={loading ? "—" : "84%"} hint="" accent="from-amber-400 to-orange-500 text-white" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-8">
           {/* CHARTS AREA */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-600"/> Candidate Pipeline Analytics</h2>
                    <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 bg-[var(--card-bg)] shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                       <option>Last 6 Months</option>
                       <option>This Year</option>
                    </select>
                 </div>
                 
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={PIPELINE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                         <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} />
                         <Line type="monotone" dataKey="applicants" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Applicants" />
                         <Line type="monotone" dataKey="interviews" stroke="#EC4899" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Interviews" />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* NATIVE DRAG & DROP PIPELINE KANBAN */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md overflow-hidden">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2"><KanbanSquare className="h-5 w-5 text-indigo-600"/> Visual Hiring Pipeline</h2>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                       <button onClick={() => setKanbanFilter('all')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${kanbanFilter === 'all' ? 'bg-[var(--card-bg)] shadow-sm text-[var(--text-main)]' : 'text-slate-500 hover:text-slate-700'}`}>All Roles</button>
                       <button onClick={() => setKanbanFilter('Frontend Engineer')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${kanbanFilter === 'Frontend Engineer' ? 'bg-[var(--card-bg)] shadow-sm text-[var(--text-main)]' : 'text-slate-500 hover:text-slate-700'}`}>Frontend</button>
                    </div>
                 </div>

                 <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
                    {kanbanStages.map(stage => {
                       const stageCands = kanbanCandidates.filter(c => c.stage === stage && (kanbanFilter === 'all' || c.role === kanbanFilter));
                       return (
                         <div key={stage} onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage)} className="min-w-[260px] flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 shrink-0 snap-start">
                            <div className="flex items-center justify-between mb-4">
                               <h3 className="font-bold text-slate-800 text-sm">{stage}</h3>
                               <span className="bg-[var(--card-bg)] border border-slate-200 text-[var(--text-muted)] text-xs font-bold px-2 py-0.5 rounded-full">{stageCands.length}</span>
                            </div>
                            <div className="flex flex-col gap-3 min-h-[150px]">
                               {stageCands.map(cand => (
                                  <div key={cand.id} draggable onDragStart={(e) => onDragStart(e, cand.id)} className="bg-[var(--card-bg)] border border-slate-200 p-3 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all group">
                                     <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                           <img src={cand.avatar} alt={cand.name} className="h-8 w-8 rounded-full shadow-sm" />
                                           <div>
                                              <p className="text-sm font-bold text-[var(--text-main)]">{cand.name}</p>
                                              <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">{cand.role}</p>
                                           </div>
                                        </div>
                                        <button className="text-slate-300 hover:text-[var(--text-muted)]"><MoreVertical className="h-4 w-4"/></button>
                                     </div>
                                  </div>
                               ))}
                               {stageCands.length === 0 && <div className="border-2 border-dashed border-slate-200 rounded-xl h-24 flex items-center justify-center text-slate-400 text-sm font-medium">Drop here</div>}
                            </div>
                         </div>
                       )
                    })}
                 </div>
              </div>
           </div>

           {/* RIGHT HAND SIDEBAR */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* INTERVIEW SCHEDULER WIDGET */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm overflow-hidden group transition-all hover:shadow-md">
                 <h2 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-600"/> Quick Schedule</h2>
                 <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); toast.success('Interview Invitation Sent!'); }}>
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">Candidate</label>
                       <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-[var(--card-bg)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors">
                          <option>Sarah Connor (Frontend Engineer)</option>
                          <option>John Doe (React Developer)</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Date</label>
                          <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-[var(--card-bg)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"/>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Time</label>
                          <input type="time" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-[var(--card-bg)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"/>
                       </div>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">Type</label>
                       <div className="flex gap-2">
                          <button type="button" className="flex-1 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl">Google Meet</button>
                          <button type="button" className="flex-1 py-2 bg-[var(--card-bg)] border border-slate-200 text-[var(--text-muted)] font-bold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors">Onsite</button>
                       </div>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl mt-2 transition-all hover:shadow-lg">Schedule Interview</button>
                 </form>
              </div>

              {/* RECRUITER NOTIFICATIONS */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md">
                 <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2"><Bell className="h-5 w-5 text-indigo-600"/> Activity Feed</h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-indigo-200 ring-inset">Live</span>
                 </div>
                 <div className="space-y-4">
                    {RECRUITER_NOTIFICATIONS.map(n => (
                       <div key={n.id} className="flex gap-4 items-start group">
                          <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${n.type === 'offer' ? 'bg-emerald-100 text-emerald-600' : n.type === 'interview' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                             {n.type === 'offer' ? <Award className="h-5 w-5" /> : n.type === 'interview' ? <Calendar className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                          </div>
                          <div className="pt-0.5">
                             <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{n.text}</p>
                             <p className="text-xs font-semibold text-slate-400 mt-1">{n.time}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md bg-gradient-to-br from-white/70 to-blue-50/50">
                 <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-600"/> Actions</h2>
                 <div className="grid grid-cols-2 gap-3">
                    <Link to="/recruiter/jobs" className="flex flex-col items-center justify-center p-4 bg-[var(--card-bg)] border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group">
                       <Briefcase className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors"/>
                       <span className="text-xs font-bold text-slate-700">Manage Jobs</span>
                    </Link>
                    <Link to="/recruiter/jobs" className="flex flex-col items-center justify-center p-4 bg-[var(--card-bg)] border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group">
                       <Users className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors"/>
                       <span className="text-xs font-bold text-slate-700">Candidates</span>
                    </Link>
                 </div>
              </div>

           </div>
        </div>
        
        {/* RECENT CANDIDATES TABLE BELOW PIPELINE */}
        <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md mt-0">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2"><ClipboardList className="h-5 w-5 text-indigo-600"/> Global Candidate List</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative w-full sm:w-64">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search candidates..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <button className="h-9 w-9 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"><Filter className="h-4 w-4 text-[var(--text-muted)]"/></button>
              </div>
           </div>

           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 rounded-tl-2xl">Candidate Name</th>
                    <th className="px-6 py-4">Applied Role</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.length === 0 && loading ? (
                     <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500 animate-pulse font-medium">Syncing candidates database...</td></tr>
                  ) : recent.length === 0 ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-10 text-center">
                           <div className="max-w-xs mx-auto">
                              <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                              <p className="text-[var(--text-main)] font-bold">No candidates yet</p>
                              <p className="text-slate-500 text-sm mt-1 mb-4">Post a new job to start receiving applications.</p>
                              <Link to="/recruiter/jobs/new" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Post Job Now →</Link>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     recent.map(a => {
                        const cand = a.candidateId;
                        const job = a.jobId;
                        return (
                          <tr key={a._id} className="transition hover:bg-slate-50/50 group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                                      {cand?.name ? cand.name.charAt(0).toUpperCase() : "C"}
                                   </div>
                                   <div>
                                      <p className="font-bold text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{cand?.name || "Candidate"}</p>
                                      <p className="text-xs font-medium text-slate-500">{cand?.email || "No email"}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 font-bold text-slate-700">{job?.title || "Role"}</td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${a.status === 'selected' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : a.status === 'rejected' ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                                   {(a.status || 'Applied').toUpperCase()}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                   {cand?.resume?.url && (
                                     <a href={cand.resume.url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors" title="Download Resume"><Download className="h-4 w-4"/></a>
                                   )}
                                   <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all">View Profile</button>
                                   <button className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors" title="Shortlist"><Check className="h-4 w-4"/></button>
                                   <button className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors" title="Reject"><X className="h-4 w-4"/></button>
                                </div>
                             </td>
                          </tr>
                        )
                     })
                  )}
                </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}

const MOCK_RECOMMENDED = [
  { id: 1, title: "Frontend Engineer", company: "Stripe", domain: "stripe.com", location: "San Francisco, CA", salary: "₹1.8M - ₹2.4M", type: "Full-time" },
  { id: 2, title: "React Developer", company: "Spotify", domain: "spotify.com", location: "Remote", salary: "₹1.2M - ₹1.8M", type: "Full-time" },
  { id: 3, title: "UI/UX Designer", company: "Airbnb", domain: "airbnb.com", location: "New York, NY", salary: "₹1.5M - ₹2.0M", type: "Contract" },
];

const MOCK_SAVED = [
  { id: 4, title: "Senior Software Engineer", company: "Netflix", domain: "netflix.com", location: "Los Gatos, CA", salary: "₹3.0M - ₹4.5M", type: "Full-time" },
  { id: 5, title: "Product Manager", company: "Apple", domain: "apple.com", location: "Sunnyvale, CA", salary: "₹2.5M - ₹3.5M", type: "Full-time" },
];

const MOCK_VIEWED = [
  { id: 6, title: "Web Developer", company: "Discord", domain: "discord.com", location: "Remote", salary: "₹1.0M - ₹1.5M", type: "Part-time" },
  { id: 7, title: "Data Analyst", company: "Uber", domain: "uber.com", location: "San Francisco, CA", salary: "₹1.4M - ₹1.9M", type: "Full-time" },
];

const MOCK_RECRUITER_ACTIVITY = [
  { id: 1, text: "Google recruiter viewed your profile", time: "2 hours ago", color: "text-blue-500", bg: "bg-blue-100", icon: Eye },
  { id: 2, text: "Your resume was downloaded by Meta", time: "1 day ago", color: "text-purple-500", bg: "bg-purple-100", icon: Download },
  { id: 3, text: "Application response from Apple", time: "3 days ago", color: "text-emerald-500", bg: "bg-emerald-100", icon: Send },
];

const MOCK_ALERTS = [
  { id: 1, text: "5 new 'React Developer' roles in Remote", count: 5 },
  { id: 2, text: "New role at Microsoft matching your skills", count: 1 },
];

function JobCardMock({ job }) {
  return (
    <div className="glass-card hover-card-effect group flex flex-col justify-between p-5">
       <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl border border-slate-100 bg-[var(--card-bg)] flex items-center justify-center overflow-hidden shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110">
             <img src={`https://logo.clearbit.com/${job.domain}`} alt={job.company} className="h-8 w-8 object-contain" onError={(e) => {e.target.onerror=null;e.target.src="https://ui-avatars.com/api/?name="+job.company;}} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-main)] group-hover:text-primary transition-colors">{job.title}</h3>
            <p className="text-sm font-medium text-slate-500">{job.company}</p>
          </div>
          <button className="ml-auto text-slate-400 hover:text-indigo-600 transition-colors"><Bookmark className="h-5 w-5"/></button>
       </div>
       <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-[var(--text-muted)]"><MapPin className="h-3 w-3" />{job.location}</span>
          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700"><DollarSign className="h-3 w-3" />{job.salary}</span>
       </div>
       <Link to="/jobs" className="mt-auto block w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary shadow-md">
          Apply Now
       </Link>
    </div>
  )
}

function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Recommended");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get("/applications/me")
      .then((res) => { if (alive) setApplications(res.data.applications || []); })
      .catch(() => alive && setApplications([]))
      .finally(() => alive && setLoading(false));
    return () => alive = false;
  }, []);

  const stats = useMemo(() => {
    const list = applications;
    const total = list.length;
    const underReview = list.filter((a) => a.status === "under_review").length;
    const interview = list.filter((a) => a.status === "interview").length;
    const selected = list.filter((a) => a.status === "selected").length;
    const offers = list.filter((a) => ["shortlisted", "selected"].includes(a.status)).length;
    return { total, underReview, interview, offers, selected };
  }, [applications]);

  const recent = useMemo(() => [...applications].sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)).slice(0, 3), [applications]);
  const completion = profileCompletionPercent(user);
  const firstName = (user?.name || "there").split(" ")[0];

  const statusStyle = (s) => {
    const map = {
      applied: "bg-sky-50 text-sky-800 ring-sky-200",
      under_review: "bg-slate-50 text-slate-800 ring-slate-200",
      shortlisted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
      interview: "bg-violet-50 text-violet-800 ring-violet-200",
      rejected: "bg-rose-50 text-rose-800 ring-rose-200",
      selected: "bg-emerald-50 text-emerald-900 ring-emerald-300",
    };
    return map[s] || "bg-slate-50 text-slate-700 ring-slate-200";
  };
  const formatStatusLabel = (s) => (s ? String(s).replaceAll("_", " ") : "");

  return (
    <div className="min-h-screen p-4 py-8 md:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card-bg)]/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none"></div>
          <div className="relative z-10 w-full md:w-auto text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-main)] mb-2 tracking-tight">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{firstName}</span> 👋
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-medium">Your next big opportunity is waiting. Let's get to work.</p>
          </div>
          <div className="flex gap-4 items-center shrink-0 w-full md:w-auto justify-center md:justify-end relative z-10">
             <Link to="/candidate" className="flex items-center gap-2 bg-[var(--card-bg)] border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 min-w-[140px] justify-center">
                Edit Profile
             </Link>
             <Link to="/jobs" className="flex items-center gap-2 bg-indigo-600 border border-indigo-600 px-6 py-3 rounded-2xl font-bold text-white hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-md transition-all shadow-sm focus:ring-2 focus:ring-indigo-500 min-w-[140px] justify-center">
                Search Jobs
             </Link>
          </div>
        </div>

        {/* 5 KPI STATUS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Send} label="Applications sent" value={loading ? "—" : stats.total} hint="" accent="from-sky-500 to-blue-600 text-white" />
          <StatCard icon={Eye} label="Under Review" value={loading ? "—" : stats.underReview} hint="" accent="from-slate-500 to-slate-700 text-white" />
          <StatCard icon={Video} label="Interviews" value={loading ? "—" : stats.interview} hint="" accent="from-violet-500 to-purple-600 text-white" />
          <StatCard icon={Target} label="Offers received" value={loading ? "—" : stats.offers} hint="" accent="from-amber-400 to-orange-500 text-white" />
          <StatCard icon={Award} label="Selections" value={loading ? "—" : stats.selected} hint="" accent="from-emerald-500 to-teal-600 text-white" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
           
           {/* MAIN CONTENT AREA */}
           <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* APPLICATION STATUS TIMELINE */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md hover:border-white/80">
                 <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 flex items-center gap-2"><Send className="h-5 w-5 text-indigo-600"/> Application Status Tracking</h2>
                 <p className="text-sm text-slate-500 mb-8 font-medium">Your most recent active application’s journey towards securing an offer.</p>
                 
                 <div className="relative pt-2">
                    <div className="absolute top-[28px] sm:top-1/2 left-8 sm:left-0 w-[2px] sm:w-full h-full sm:h-1 bg-slate-200 sm:-translate-y-1/2 rounded-full hidden sm:block"></div>
                    <div className="absolute top-[28px] sm:top-1/2 left-8 sm:left-0 w-[2px] sm:w-[40%] h-1/3 sm:h-1 bg-gradient-to-b sm:bg-gradient-to-r from-indigo-500 to-purple-500 sm:-translate-y-1/2 rounded-full hidden sm:block"></div>
                    <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                       {["Applied", "Under Review", "Interview", "Offer", "Selected"].map((step, i) => {
                          const statusActive = i <= 1; // mock: currently under review
                          return (
                            <div key={step} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 group/step">
                               <div className={`h-12 w-12 sm:h-10 sm:w-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${statusActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'bg-[var(--card-bg)] border-slate-300 text-slate-400 group-hover/step:border-indigo-300'}`}>
                                  {statusActive ? <Check className="h-5 w-5" strokeWidth={3} /> : <div className="h-2.5 w-2.5 rounded-full bg-slate-300 group-hover/step:bg-indigo-300 transition-colors" />}
                               </div>
                               <span className={`text-sm font-bold ${statusActive ? 'text-[var(--text-main)]' : 'text-slate-500'} group-hover/step:text-[var(--text-main)] transition-colors`}>{step}</span>
                            </div>
                          )
                       })}
                    </div>
                 </div>
              </div>

              {/* DYNAMIC JOB CAROUSELS TABS */}
              <div>
                 <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
                    {["Recommended", "Saved Jobs", "Recently Viewed"].map(tab => (
                       <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm ${activeTab === tab ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-[var(--card-bg)]/60 border border-white/60 text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-main)] shadow-none hover:border-slate-200'}`}>
                          {tab}
                       </button>
                    ))}
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    {activeTab === "Recommended" && MOCK_RECOMMENDED.map(job => <JobCardMock key={job.id} job={job} />)}
                    {activeTab === "Saved Jobs" && MOCK_SAVED.map(job => <JobCardMock key={job.id} job={job} />)}
                    {activeTab === "Recently Viewed" && MOCK_VIEWED.map(job => <JobCardMock key={job.id} job={job} />)}
                 </div>
              </div>

              {/* RECENT APPLICATIONS LIST */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-md hover:border-white/80">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2"><ClipboardList className="h-5 w-5 text-indigo-600"/> Recent Applications</h2>
                    <Link to="/candidate/applications" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All</Link>
                 </div>
                 <div className="space-y-4">
                    {loading ? (
                      <div className="py-8 text-center text-slate-500 animate-pulse">Loading applications...</div>
                    ) : recent.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-[var(--card-bg)]/50">
                        <p className="font-bold text-[var(--text-main)]">No applications sent</p>
                        <p className="text-sm text-slate-500 mt-1">Start browsing jobs to send your first application!</p>
                      </div>
                    ) : (
                      recent.map(a => {
                         const job = a.jobId;
                         return (
                           <Link key={a._id} to={job?._id ? `/jobs/${job._id}` : "/candidate/applications"} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/50 bg-[var(--card-bg)]/50 hover:bg-[var(--card-bg)] hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                             <div className="min-w-0">
                                <h4 className="font-bold text-[var(--text-main)] group-hover:text-indigo-600 transition-colors truncate">{job?.title || "Job Title"}</h4>
                                <p className="text-sm text-slate-500 mt-0.5 font-medium">{job?.recruiterId?.company?.name || "Company"}</p>
                             </div>
                             <div className="flex items-center gap-3 shrink-0">
                                <span className={["rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ring-inset whitespace-nowrap", statusStyle(a.status)].join(" ")}>
                                  {formatStatusLabel(a.status)}
                                </span>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1 hidden sm:block" />
                             </div>
                           </Link>
                         )
                      })
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT HAND SIDEBAR */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* PROFILE COMPLETION WIDGET */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{width:`${completion}%`}}></div>
                 </div>
                 <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 mt-2">Profile strength</h2>
                 <p className="text-sm text-indigo-600 font-bold mb-6">{completion}% Completed</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 group/item">
                       <CheckCircle className={`h-5 w-5 shrink-0 transition-colors ${completion > 20 ? 'text-emerald-500' : 'text-slate-300 group-hover/item:text-slate-400'}`} />
                       <div>
                          <p className="text-sm font-bold text-slate-800">Basic Information</p>
                          <p className="text-xs text-slate-500 font-medium">Name and preferences added</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                       <CheckCircle className={`h-5 w-5 shrink-0 transition-colors ${Array.isArray(user?.skills) && user.skills.length > 0 ? 'text-emerald-500' : 'text-slate-300 group-hover/item:text-slate-400'}`} />
                       <div>
                          <p className="text-sm font-bold text-slate-800">Add Top Skills</p>
                          <p className="text-xs text-slate-500 font-medium">Highlight your stack to get matched.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 group/item">
                       <CheckCircle className={`h-5 w-5 shrink-0 transition-colors ${user?.resume?.url ? 'text-emerald-500' : 'text-slate-300 group-hover/item:text-slate-400'}`} />
                       <div>
                          <p className="text-sm font-bold text-slate-800">Upload Resume</p>
                          <p className="text-xs text-slate-500 font-medium">PDF parsing enables 1-click apply.</p>
                       </div>
                    </div>
                 </div>
                 <Link to="/candidate" className="block w-full text-center mt-6 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                   Confirm Elements
                 </Link>
              </div>

              {/* RECRUITER ACTIVITY FEED */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md">
                 <h2 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2"><Eye className="h-5 w-5 text-indigo-600"/> Recruiter Activity</h2>
                 <div className="space-y-5">
                    {MOCK_RECRUITER_ACTIVITY.map(act => {
                       const Icon = act.icon;
                       return (
                         <div key={act.id} className="flex gap-4 items-start group relative">
                            <div className="absolute left-5 top-10 bottom-[-20px] w-0.5 bg-slate-100 last:bg-transparent"></div>
                            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${act.bg} ${act.color} transition-transform duration-300 group-hover:scale-110 z-10 shadow-sm`}>
                               <Icon className="h-4 w-4 stroke-[2.5]" />
                            </div>
                            <div className="pt-1">
                               <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{act.text}</p>
                               <p className="text-xs font-semibold text-slate-400 mt-1">{act.time}</p>
                            </div>
                         </div>
                       )
                    })}
                 </div>
                 <button className="w-full text-center mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-all">Open Activity Log →</button>
              </div>

              {/* JOB ALERTS */}
              <div className="rounded-3xl border border-white/60 bg-[var(--card-bg)]/70 backdrop-blur-xl p-6 shadow-sm bg-gradient-to-br from-white/70 to-indigo-50/30 transition-all hover:shadow-md">
                 <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2"><Bell className="h-5 w-5 text-indigo-600"/> Job Alerts</h2>
                    <span className="bg-rose-500 text-white text-[10px] tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">2 NEW</span>
                 </div>
                 <div className="space-y-3">
                    {MOCK_ALERTS.map(alert => (
                       <div key={alert.id} className="bg-[var(--card-bg)] border border-slate-200/60 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer border-l-[3px] border-l-indigo-500 hover:-translate-y-0.5 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <p className="text-sm font-bold text-slate-800 leading-snug relative z-10">{alert.text}</p>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "candidate") {
    return <CandidateDashboard />;
  }

  if (user.role === "recruiter") {
    return <RecruiterDashboard />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-h2 text-[var(--text-main)]">Admin dashboard</h1>
        <p className="mt-2 text-body text-[var(--text-muted)]">Signed in as {user.name}. Choose an area to manage.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-[var(--text-main)]">Analytics</h2>
          <p className="mt-2 text-small text-[var(--text-muted)]">Totals, top companies, and most-applied jobs.</p>
          <Link to="/admin" className="btn-secondary mt-6 w-full">
            Open analytics
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-[var(--text-main)]">Users</h2>
          <p className="mt-2 text-small text-[var(--text-muted)]">Block or unblock accounts when needed.</p>
          <Link to="/admin/users" className="btn-secondary mt-6 w-full">
            Manage users
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-[var(--text-main)]">Jobs</h2>
          <p className="mt-2 text-small text-[var(--text-muted)]">Review and deactivate listings.</p>
          <Link to="/admin/jobs" className="btn-secondary mt-6 w-full">
            Review jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
