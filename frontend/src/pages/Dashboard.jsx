import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  ChevronRight,
  Bell,
  ClipboardList,
  ExternalLink,
  Plus,
  Send,
  Sparkles,
  Star,
  Upload,
  UserCheck,
  UserPen,
  Users,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../state/AuthContext.jsx";
import { api } from "../utils/api.js";

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
        "group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card transition duration-300",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover",
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
      <div className="text-3xl font-semibold tracking-tight text-dark tabular-nums">{value}</div>
      <div className="mt-1 text-small font-medium text-slate-600">{label}</div>
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
        <span className="block text-small font-semibold text-dark">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </>
  );

  const className = [
    "group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition duration-300",
    primary
      ? "border-primary/30 bg-gradient-to-br from-primary/[0.06] to-indigo-500/[0.04] shadow-sm hover:border-primary/50 hover:shadow-md"
      : "border-slate-200/90 bg-white hover:border-primary/25 hover:shadow-card",
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
        "flex min-w-[5.5rem] flex-1 flex-col items-center rounded-2xl border border-slate-200/90 bg-white px-3 py-4 text-center shadow-sm transition duration-300",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:min-w-[6.5rem]",
      ].join(" ")}
    >
      <div className={`text-2xl font-bold tabular-nums ${accent}`}>{count}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function RecruiterDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/jobs/mine/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {
        setData(null);
        toast.error("Could not load dashboard data.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const setApplicationStatus = async (id, status) => {
    setActionId(id);
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success("Application status updated");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setActionId(null);
    }
  };

  const firstName = (user?.name || "there").split(" ")[0];
  const stats = data?.stats;
  const jobs = data?.jobs || [];
  const pipeline = data?.pipeline || {};
  const recent = data?.recentApplications || [];

  const appStatusClass = (s) => {
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

  const formatAppStatus = (s) => (s ? String(s).replaceAll("_", " ") : "—");

  const recruiterStatusOptions = [
    { value: "applied", label: "Applied" },
    { value: "under_review", label: "Under review" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interview", label: "Interview" },
    { value: "rejected", label: "Rejected" },
    { value: "selected", label: "Selected" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/90 to-indigo-50/40 p-6 shadow-card md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-h2 text-dark md:text-[2rem]">
              Welcome back, {firstName}{" "}
              <span className="inline-block origin-[70%_70%] animate-wave" aria-hidden>
                👋
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-body text-slate-600">
              Manage job listings, track your hiring pipeline, and move candidates forward—all from one recruiter
              workspace.
            </p>
          </div>
          <Link
            to="/recruiter/jobs/new"
            className="group inline-flex min-h-[3rem] shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-8 text-small font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-indigo-600 hover:to-primary hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98] md:px-10"
          >
            <Plus className="h-5 w-5 transition group-hover:rotate-90" strokeWidth={2.5} aria-hidden />
            Post new job
            <ArrowRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Active jobs"
          value={loading ? "—" : stats?.activeJobs ?? 0}
          hint="Live listings candidates can see."
          accent="from-sky-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          label="Total applicants"
          value={loading ? "—" : stats?.totalApplicants ?? 0}
          hint="Across all of your postings."
          accent="from-indigo-500 to-violet-600"
        />
        <StatCard
          icon={Calendar}
          label="Interviews / shortlisted"
          value={loading ? "—" : stats?.interviewsScheduled ?? 0}
          hint="Shortlisted maps to your interview-ready pool today."
          accent="from-violet-500 to-purple-600"
        />
        <StatCard
          icon={UserCheck}
          label="Hired candidates"
          value={loading ? "—" : stats?.hiredCandidates ?? 0}
          hint="Hired stage when you add it to your workflow."
          accent="from-emerald-500 to-teal-600"
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-10 lg:col-span-8">
          <section>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-h3 text-dark">
                <ClipboardList className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
                My job listings
              </h2>
              <Link to="/recruiter/jobs" className="text-small font-semibold text-primary hover:text-accent">
                Open jobs manager →
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-small">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3.5">Job title</th>
                      <th className="px-4 py-3.5">Applicants</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          Loading listings…
                        </td>
                      </tr>
                    ) : jobs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          No jobs yet. Post your first role to start collecting applicants.
                        </td>
                      </tr>
                    ) : (
                      jobs.map((j) => (
                        <tr key={j._id} className="transition hover:bg-slate-50/80">
                          <td className="px-4 py-4">
                            <div className="font-semibold text-dark">{j.title}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {j.category || "—"} · {j.location || "—"}
                            </div>
                          </td>
                          <td className="px-4 py-4 tabular-nums text-slate-700">{j.applicantCount ?? 0}</td>
                          <td className="px-4 py-4">
                            <span
                              className={[
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                                j.isActive ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200",
                              ].join(" ")}
                            >
                              {j.isActive ? "Active" : "Closed"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap justify-end gap-2">
                              <Link
                                to={`/recruiter/jobs/${j._id}/applicants`}
                                className="inline-flex min-h-[2.25rem] items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-dark shadow-sm transition hover:border-primary/30 hover:bg-primary/5"
                              >
                                View applicants
                              </Link>
                              <Link
                                to={`/recruiter/jobs/${j._id}/edit`}
                                className="inline-flex min-h-[2.25rem] items-center rounded-xl bg-primary px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                              >
                                Edit job
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 flex items-center gap-2 text-h3 text-dark">
              <Users className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
              Applicants pipeline
            </h2>
            <p className="mb-4 text-small text-slate-600">
              Stages map to application statuses: screening is under review, offer is shortlisted, hired is selected.
            </p>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card sm:flex-row sm:items-stretch sm:justify-between sm:gap-2 sm:p-5">
              <PipelineStep label="Applied" count={loading ? "—" : pipeline.applied ?? 0} accent="text-sky-600" />
              <div className="hidden items-center px-1 text-slate-300 sm:flex" aria-hidden>
                <ChevronRight className="h-5 w-5" />
              </div>
              <PipelineStep label="Screening" count={loading ? "—" : pipeline.screening ?? 0} accent="text-slate-600" />
              <div className="hidden items-center px-1 text-slate-300 sm:flex" aria-hidden>
                <ChevronRight className="h-5 w-5" />
              </div>
              <PipelineStep
                label="Interview"
                count={loading ? "—" : pipeline.interview ?? 0}
                accent="text-violet-600"
              />
              <div className="hidden items-center px-1 text-slate-300 sm:flex" aria-hidden>
                <ChevronRight className="h-5 w-5" />
              </div>
              <PipelineStep label="Offer" count={loading ? "—" : pipeline.offer ?? 0} accent="text-amber-600" />
              <div className="hidden items-center px-1 text-slate-300 sm:flex" aria-hidden>
                <ChevronRight className="h-5 w-5" />
              </div>
              <PipelineStep label="Hired" count={loading ? "—" : pipeline.hired ?? 0} accent="text-emerald-600" />
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-h3 text-dark">
                <Sparkles className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
                Recent applicants
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-small">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Job</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          Loading applicants…
                        </td>
                      </tr>
                    ) : recent.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                          No applicants yet. Share your active jobs to start receiving candidates.
                        </td>
                      </tr>
                    ) : (
                      recent.map((a) => {
                        const cand = a.candidateId;
                        const job = a.jobId;
                        const jobId = job?._id || a.jobId;
                        const resumeUrl = cand?.resume?.url ? `${API_ORIGIN}${cand.resume.url}` : null;
                        return (
                          <tr key={a._id} className="transition hover:bg-slate-50/80">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-dark">{cand?.name || "Candidate"}</div>
                              <div className="mt-0.5 text-xs text-slate-500">{cand?.email || "—"}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium text-slate-800">{job?.title || "Job"}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={[
                                  "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                                  appStatusClass(a.status),
                                ].join(" ")}
                              >
                                {formatAppStatus(a.status)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap justify-end gap-2">
                                {jobId ? (
                                  <Link
                                    to={`/recruiter/jobs/${jobId}/applicants`}
                                    className="inline-flex min-h-[2rem] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-dark transition hover:border-primary/30 hover:bg-slate-50"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                                    Pipeline
                                  </Link>
                                ) : null}
                                {resumeUrl ? (
                                  <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[2rem] items-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5"
                                  >
                                    Resume
                                  </a>
                                ) : null}
                                <select
                                  aria-label="Update application status"
                                  disabled={actionId === a._id}
                                  value={a.status || "applied"}
                                  onChange={(e) => setApplicationStatus(a._id, e.target.value)}
                                  className="min-h-[2rem] max-w-[10.5rem] rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-dark shadow-sm transition hover:border-primary/30 disabled:opacity-50"
                                >
                                  {recruiterStatusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card lg:p-6">
            <h2 className="flex items-center gap-2 text-h3 text-dark">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              Quick actions
            </h2>
            <p className="text-xs text-slate-500">Shortcuts to the workflows you use most.</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/recruiter/jobs/new"
                className="group flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-4 text-small font-semibold text-white shadow-lg shadow-primary/25 transition hover:from-indigo-600 hover:to-primary hover:shadow-xl active:scale-[0.98]"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                Post new job
              </Link>
              <Link
                to="/recruiter/jobs"
                className="flex min-h-[2.85rem] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-small font-semibold text-dark transition hover:border-primary/25 hover:bg-white hover:shadow-md"
              >
                <Users className="h-4 w-4 text-primary" aria-hidden />
                Review applicants
              </Link>
              <Link
                to="/recruiter/jobs"
                className="flex min-h-[2.85rem] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-small font-semibold text-dark transition hover:border-primary/25 hover:shadow-md"
              >
                <ClipboardList className="h-4 w-4 text-primary" aria-hidden />
                Manage jobs
              </Link>
              <button
                type="button"
                onClick={() =>
                  toast("Open a job → View applicants to shortlist and track next steps.", { icon: "📅" })
                }
                className="flex min-h-[2.85rem] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-small font-semibold text-dark transition hover:border-primary/25 hover:shadow-md"
              >
                <Calendar className="h-4 w-4 text-primary" aria-hidden />
                Schedule interview
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/applications/me")
      .then((res) => {
        if (alive) setApplications(res.data.applications || []);
      })
      .catch(() => alive && setApplications([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const list = applications;
    const total = list.length;
    const underReview = list.filter((a) => a.status === "under_review").length;
    const interview = list.filter((a) => a.status === "interview").length;
    const selected = list.filter((a) => a.status === "selected").length;
    const rejected = list.filter((a) => a.status === "rejected").length;
    return { total, underReview, interview, selected, rejected };
  }, [applications]);

  const recent = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt))
      .slice(0, 6);
  }, [applications]);

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
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/90 to-indigo-50/50 p-6 shadow-card md:p-8">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h2 text-dark md:text-[2rem]">
                Welcome back, {firstName}{" "}
                <span className="inline-block origin-[70%_70%] animate-wave" aria-hidden>
                  👋
                </span>
              </h1>
            </div>
            <p className="mt-2 max-w-xl text-body text-slate-600">
              Here’s a snapshot of your job search. Update your profile and keep applications moving.
            </p>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-small font-semibold text-dark">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                Profile strength
              </div>
              <span className="text-small font-bold tabular-nums text-primary">{completion}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${completion}%` }}
                role="progressbar"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {completion >= 100
                ? "Profile looks complete."
                : "Add skills, qualification, and a resume to stand out."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Send}
          label="Applications sent"
          value={loading ? "—" : stats.total}
          hint="Total roles you’ve applied to."
          accent="from-sky-500 to-blue-600"
        />
        <StatCard
          icon={ClipboardList}
          label="Under review"
          value={loading ? "—" : stats.underReview}
          hint="Recruiters are reviewing your profile for these roles."
          accent="from-slate-500 to-slate-700"
        />
        <StatCard
          icon={Video}
          label="Interviews"
          value={loading ? "—" : stats.interview}
          hint="Roles where your status moved to interview."
          accent="from-violet-500 to-indigo-600"
        />
        <StatCard
          icon={Star}
          label="Selected"
          value={loading ? "—" : stats.selected}
          hint="Congratulations — offers and selections land here."
          accent="from-emerald-500 to-teal-600"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        <section className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-h3 text-dark">
              <Briefcase className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
              Recent applications
            </h2>
            <Link
              to="/candidate/applications"
              className="text-small font-semibold text-primary transition hover:text-accent"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[4.5rem] animate-pulse rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                />
              ))
            ) : recent.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-10 text-center shadow-sm">
                <p className="text-body font-medium text-dark">No applications yet</p>
                <p className="mt-2 text-small text-slate-600">Browse open roles and apply in one click.</p>
                <Link
                  to="/jobs"
                  className="btn-primary mx-auto mt-6 max-w-xs shadow-md transition hover:shadow-card-hover"
                >
                  Browse jobs
                </Link>
              </div>
            ) : (
              recent.map((a) => {
                const job = a.jobId;
                const jid = job?._id;
                return (
                  <Link
                    key={a._id}
                    to={jid ? `/jobs/${jid}` : "/candidate/applications"}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-dark group-hover:text-primary">{job?.title || "Job"}</div>
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {job?.recruiterId?.company?.name || job?.recruiterId?.name || "Company"} ·{" "}
                        {job?.location || "—"}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          statusStyle(a.status),
                        ].join(" ")}
                      >
                        {formatStatusLabel(a.status)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <aside className="lg:col-span-5">
          <h2 className="mb-4 flex items-center gap-2 text-h3 text-dark">
            <Sparkles className="h-6 w-6 text-primary" strokeWidth={2} aria-hidden />
            Quick actions
          </h2>
          <div className="flex flex-col gap-3">
            <QuickAction
              to="/candidate"
              icon={UserPen}
              title="Edit profile"
              subtitle="Skills, qualification, and preferences"
              primary
            />
            <QuickAction
              to="/candidate#resume-upload"
              icon={Upload}
              title="Upload resume"
              subtitle="PDF resume for recruiters"
            />
            <QuickAction
              to="/candidate/saved-jobs"
              icon={Bookmark}
              title="Saved jobs"
              subtitle="Roles you bookmarked for later"
            />
            <QuickAction
              to="/candidate/notifications"
              icon={Bell}
              title="Notifications"
              subtitle="Application updates and alerts"
            />
            <QuickAction to="/jobs" icon={Briefcase} title="Browse jobs" subtitle="Search and filter open roles" />
          </div>
        </aside>
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
        <h1 className="text-h2 text-dark">Admin dashboard</h1>
        <p className="mt-2 text-body text-slate-600">Signed in as {user.name}. Choose an area to manage.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-dark">Analytics</h2>
          <p className="mt-2 text-small text-slate-600">Totals, top companies, and most-applied jobs.</p>
          <Link to="/admin" className="btn-secondary mt-6 w-full">
            Open analytics
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-dark">Users</h2>
          <p className="mt-2 text-small text-slate-600">Block or unblock accounts when needed.</p>
          <Link to="/admin/users" className="btn-secondary mt-6 w-full">
            Manage users
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
          <h2 className="text-h3 text-dark">Jobs</h2>
          <p className="mt-2 text-small text-slate-600">Review and deactivate listings.</p>
          <Link to="/admin/jobs" className="btn-secondary mt-6 w-full">
            Review jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
