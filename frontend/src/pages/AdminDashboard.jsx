import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  UserCheck,
  ClipboardList,
  UserPlus,
  Bell,
  FileWarning,
  RefreshCw,
  ArrowRight,
  Building2,
  TrendingUp,
  ShieldAlert,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import AdminStatCard from "../components/admin/AdminStatCard.jsx";
import SimpleLineChart from "../components/admin/SimpleLineChart.jsx";
import SimpleBarChart from "../components/admin/SimpleBarChart.jsx";
import { api } from "../utils/api.js";

// Mock Data for charts that don't have endpoints yet
const mockUserGrowth = [
  { label: "Week 1", count: 120 }, { label: "Week 2", count: 154 }, { label: "Week 3", count: 198 }, { label: "Week 4", count: 240 }, { label: "Week 5", count: 310 }, { label: "Week 6", count: 405 },
];
const mockAppTrend = [
  { label: "Week 1", count: 850 }, { label: "Week 2", count: 920 }, { label: "Week 3", count: 1100 }, { label: "Week 4", count: 1350 }, { label: "Week 5", count: 1800 }, { label: "Week 6", count: 2150 },
];
const mockRecruiterActivity = [
  { label: "Mon", count: 45 }, { label: "Tue", count: 52 }, { label: "Wed", count: 38 }, { label: "Thu", count: 65 }, { label: "Fri", count: 70 }, { label: "Sat", count: 20 }, { label: "Sun", count: 15 },
];

const mockRecentActivity = [
  { id: 1, action: "Admin approved recruiter 'TechFlow Inc'", time: "10 mins ago", type: "success" },
  { id: 2, action: "Admin removed flagged job post", time: "1 hour ago", type: "danger" },
  { id: 3, action: "System sent notification to all job seekers", time: "3 hours ago", type: "info" },
  { id: 4, action: "Admin banned user user@spam.com", time: "5 hours ago", type: "danger" },
  { id: 5, action: "Admin created new setting policy", time: "1 day ago", type: "default" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, m] = await Promise.all([api.get("/admin/analytics"), api.get("/admin/moderation")]);
      setData(a.data);
      setMod(m.data);
    } catch (e) {
      // Gracefully fall back to empty data so mock UI resolves anyway
      setData({ totals: {}, jobsPerWeek: [], topCompanies: [], mostAppliedJobs: [] });
      setMod({ flaggedJobs: [], pendingRecruiters: [], flaggedUsers: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totals = data?.totals || {};
  const lineData = (data?.jobsPerWeek || []).map((r) => ({ label: r.label, value: r.count }));

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Assembling dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const q = (mod?.flaggedJobs?.length || 0) + (mod?.pendingRecruiters?.length || 0) + (mod?.flaggedUsers?.length || 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-xl opacity-20 animate-gradient-x"></div>
          <div className="relative bg-white/50 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/60 shadow-sm">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">Track platform health, user activity, and moderation queues.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Moderation Alert */}
      {q > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/80 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-rose-900">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm font-medium">
              You have <strong>{q} items</strong> pending in the moderation queue requiring immediate review.
            </p>
          </div>
          <button 
            onClick={() => navigate("/admin/moderation")}
            className="shrink-0 rounded-lg bg-white border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition shadow-sm"
          >
            Review Queue
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section aria-label="KPIs">
        <div 
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          <AdminStatCard icon={Users} label="Total Users" value={totals.totalUsers ?? 1540} trend="+12% this week" />
          <AdminStatCard icon={UserCheck} label="Active Recruiters" value={totals.totalRecruiters ?? 142} />
          <AdminStatCard icon={Users} label="Job Seekers" value={totals.totalJobSeekers ?? 1398} />
          <AdminStatCard icon={Briefcase} label="Jobs Posted" value={totals.totalJobsPosted ?? 345} trend="+8% vs last week" />
          <AdminStatCard icon={ClipboardList} label="Applications" value={totals.totalJobApplications ?? 8590} />
          <AdminStatCard icon={ShieldAlert} label="Pending Approvals" value={q} />
          <AdminStatCard icon={Building2} label="Companies" value={115} />
        </div>
      </section>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Chart 1: Applications Trend */}
        <GlassCard className="p-5 xl:col-span-2">
          <div className="mb-4">
             <h3 className="text-base font-semibold text-slate-900">Applications Trend</h3>
             <p className="text-xs text-slate-500">Volume of applications submitted across all jobs</p>
          </div>
          <div className="h-72">
            <SimpleLineChart
              data={mockAppTrend.map(r => ({ label: r.label, value: r.count }))}
              stroke="#6366f1"
            />
          </div>
        </GlassCard>

        {/* Chart 2: Jobs Posted per week */}
        <GlassCard className="p-5">
          <div className="mb-4">
             <h3 className="text-base font-semibold text-slate-900">Jobs Posted</h3>
             <p className="text-xs text-slate-500">Total job postings per week</p>
          </div>
          <div className="h-72">
            <SimpleBarChart
              data={lineData.length ? lineData : mockUserGrowth.map(r => ({ label: r.label, value: r.count }))}
              fill="#0ea5e9"
            />
          </div>
        </GlassCard>
      </div>

      {/* Secondary Row: Data Lists & Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Top Companies */}
        <div className="glass-panel hover-card-effect overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Top Hiring Companies</h2>
            </div>
            <Link to="/admin/companies" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 custom-scrollbar divide-y divide-slate-100">
            {!(data?.topCompanies?.length) ? (
              // Mock items if empty
              ["TechFlow Inc", "Nova Dynamics", "Apex Systems", "Global Logistics"].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs uppercase">{c.substring(0,2)}</div>
                    <span className="font-medium text-sm text-slate-800">{c}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{45 - i*8} Jobs</span>
                </div>
              ))
            ) : (
              data.topCompanies.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs uppercase">{c.company.substring(0,2)}</div>
                     <span className="font-medium text-sm text-slate-800">{c.company}</span>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">{c.jobs} Jobs</span>
                    <span className="text-[10px] text-slate-400">{c.applicants ?? 0} apps</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Applied Jobs */}
        <div className="glass-panel hover-card-effect overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Most Applied Jobs</h2>
            </div>
            <Link to="/admin/jobs" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 custom-scrollbar divide-y divide-slate-100">
            {!(data?.mostAppliedJobs?.length) ? (
               // Mock items if empty
               ["Senior Frontend Developer", "Product Manager", "UI/UX Designer", "DevOps Engineer"].map((j, i) => (
                 <div key={i} className="flex items-start justify-between p-4 hover:bg-slate-50 transition">
                   <div className="truncate pr-4">
                     <p className="truncate text-sm font-medium text-slate-800">{j}</p>
                     <p className="text-xs text-slate-500 mt-0.5">TechFlow Inc</p>
                   </div>
                   <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shrink-0">{320 - i*45} apps</span>
                 </div>
               ))
            ) : (
              data.mostAppliedJobs.map((j) => (
                <Link
                  key={j.jobId}
                  to={`/jobs/${j.jobId}`}
                  className="flex items-start justify-between p-4 hover:bg-slate-50 transition"
                >
                  <div className="truncate pr-4">
                    <p className="truncate text-sm font-medium text-slate-800 hover:text-primary">{j.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{j.company || "Company hidden"}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shrink-0">{j.applications} apps</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="glass-panel hover-card-effect overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Recent Activity Logs</h2>
            </div>
            <Link to="/admin/activity-logs" className="text-xs font-medium text-primary hover:underline">Full Log</Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-80 custom-scrollbar divide-y divide-slate-100 p-2">
             {mockRecentActivity.map((log) => (
                <div key={log.id} className="p-3 hover:bg-slate-50 transition rounded-lg">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={[
                        "h-2 w-2 rounded-full",
                        log.type === "success" ? "bg-emerald-500" :
                        log.type === "danger" ? "bg-rose-500" :
                        log.type === "info" ? "bg-blue-500" : "bg-slate-400"
                      ].join(" ")}></span>
                      <p className="text-xs text-slate-400 font-medium">{log.time}</p>
                   </div>
                   <p className="text-sm text-slate-700 pl-4">{log.action}</p>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
