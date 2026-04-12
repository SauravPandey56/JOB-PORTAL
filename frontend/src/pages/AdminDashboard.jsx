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
} from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import AdminStatCard from "../components/admin/AdminStatCard.jsx";
import SimpleLineChart from "../components/admin/SimpleLineChart.jsx";
import { api } from "../utils/api.js";

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
      toast.error(e?.response?.data?.message || "Failed to load dashboard");
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
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <GlassCard className="flex items-center gap-3 px-8 py-6 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading overview…
        </GlassCard>
      </div>
    );
  }

  const q = (mod?.flaggedJobs?.length || 0) + (mod?.pendingRecruiters?.length || 0) + (mod?.flaggedUsers?.length || 0);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Platform health, moderation queue, and key hiring metrics.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <GlassCard className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick actions</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <UserPlus className="h-4 w-4" />
            Add admin / users
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/recruiters")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <UserCheck className="h-4 w-4" />
            Verify recruiter
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/jobs")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FileWarning className="h-4 w-4" />
            Remove job
          </button>
          <button
            type="button"
            onClick={() => toast.success("Notification center is coming soon.", { icon: "📣" })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />
            Send notification
          </button>
        </div>
      </GlassCard>

      {q > 0 ? (
        <Link
          to="/admin/moderation"
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
        >
          <span>
            <strong>{q}</strong> item{q === 1 ? "" : "s"} need attention in moderation.
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      ) : null}

      <section aria-label="KPIs">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard icon={Users} label="Total users" value={totals.totalUsers ?? 0} trend="Live count" />
          <AdminStatCard icon={UserCheck} label="Recruiters" value={totals.totalRecruiters ?? 0} />
          <AdminStatCard icon={Users} label="Job seekers" value={totals.totalJobSeekers ?? 0} />
          <AdminStatCard icon={Briefcase} label="Jobs posted" value={totals.totalJobsPosted ?? 0} />
          <AdminStatCard icon={ClipboardList} label="Applications" value={totals.totalJobApplications ?? 0} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <SimpleLineChart
            title="Jobs posted per week"
            subtitle="Last ~8 weeks"
            data={lineData}
            stroke="#0ea5e9"
          />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">Shortcuts</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["User directory", "/admin/users"],
              ["Recruiter queue", "/admin/recruiters"],
              ["Job moderation", "/admin/jobs"],
              ["Applications", "/admin/applications"],
              ["Feedback inbox", "/admin/feedback"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link to={href} className="flex items-center justify-between rounded-lg px-2 py-2 text-slate-700 hover:bg-slate-50">
                  {label}
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Building2 className="h-5 w-5 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Top companies</h2>
            <Link to="/admin/analytics" className="ml-auto text-xs font-medium text-primary hover:underline">
              Analytics
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.topCompanies || []).length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No data yet.</p>
            ) : (
              data.topCompanies.map((c) => (
                <div key={c.company} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50/80">
                  <span className="truncate font-medium text-slate-800">{c.company}</span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    {c.jobs} jobs · {c.applicants ?? 0} applicants
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
        <GlassCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <TrendingUp className="h-5 w-5 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Most applied jobs</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.mostAppliedJobs || []).length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No applications yet.</p>
            ) : (
              data.mostAppliedJobs.map((j) => (
                <Link
                  key={j.jobId}
                  to={`/jobs/${j.jobId}`}
                  className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50/80"
                >
                  <span className="truncate font-medium text-primary">{j.title}</span>
                  <span className="shrink-0 tabular-nums text-slate-600">{j.applications}</span>
                </Link>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
