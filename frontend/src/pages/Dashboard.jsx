import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "candidate") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <h2 className="text-2xl font-semibold">Candidate dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="font-medium">Profile</h3>
            <p className="mt-1 text-sm text-slate-200">Update skills, qualification, resume.</p>
            <Link to="/candidate" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Open
            </Link>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-medium">Applications</h3>
            <p className="mt-1 text-sm text-slate-200">Track applied / shortlisted / rejected.</p>
            <Link to="/candidate/applications" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              View
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (user.role === "recruiter") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <h2 className="text-2xl font-semibold">Recruiter dashboard</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6">
            <h3 className="font-medium">My jobs</h3>
            <p className="mt-1 text-sm text-slate-200">Create, edit, delete postings.</p>
            <Link to="/recruiter/jobs" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Manage
            </Link>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-medium">Applicants</h3>
            <p className="mt-1 text-sm text-slate-200">Review and update statuses.</p>
            <Link to="/recruiter/applicants" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
              Review
            </Link>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-medium">Post a job</h3>
            <p className="mt-1 text-sm text-slate-200">Publish a new opening in minutes.</p>
            <Link to="/recruiter/jobs/new" className="mt-4 inline-block rounded-xl bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400">
              Create
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">Admin dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-6">
          <h3 className="font-medium">Analytics</h3>
          <p className="mt-1 text-sm text-slate-200">Totals, top companies, most applied jobs.</p>
          <Link to="/admin" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Open
          </Link>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-medium">Users</h3>
          <p className="mt-1 text-sm text-slate-200">Block/unblock suspicious accounts.</p>
          <Link to="/admin/users" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Manage
          </Link>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-medium">Jobs</h3>
          <p className="mt-1 text-sm text-slate-200">Deactivate fake listings.</p>
          <Link to="/admin/jobs" className="mt-4 inline-block rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Review
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}

