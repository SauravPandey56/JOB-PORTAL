import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, MapPin, IndianRupee, Briefcase } from "lucide-react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import toast from "react-hot-toast";

function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <GlassCard className="animate-pulse p-8">
        <div className="h-8 w-[66%] rounded-lg bg-slate-100" />
        <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-8 h-40 rounded-xl bg-slate-100" />
      </GlassCard>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const { isAuthed, user, refreshMe } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/jobs/${id}`)
      .then((res) => alive && setJob(res.data.job))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isAuthed || user?.role !== "candidate" || !id) return;
    let alive = true;
    api
      .get("/users/me/saved-jobs")
      .then((res) => {
        if (!alive) return;
        const ids = new Set((res.data.jobs || []).map((j) => String(j._id)));
        setSaved(ids.has(String(id)));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isAuthed, user?.role, id]);

  const apply = async () => {
    setBusy(true);
    try {
      await api.post(`/applications/apply/${id}`);
      toast.success("Applied");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to apply");
    } finally {
      setBusy(false);
    }
  };

  const toggleSave = async () => {
    if (!isAuthed || user?.role !== "candidate") {
      toast.error("Sign in as a candidate to save jobs");
      return;
    }
    setBusy(true);
    try {
      if (saved) {
        await api.delete(`/users/me/saved-jobs/${id}`);
        setSaved(false);
        toast.success("Removed from saved");
      } else {
        await api.post(`/users/me/saved-jobs/${id}`);
        setSaved(true);
        toast.success("Saved");
      }
      refreshMe?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not update");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Skeleton />;
  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <GlassCard className="p-6">Job not found.</GlassCard>
      </div>
    );
  }

  const canApply = isAuthed && user?.role === "candidate";
  const company = job.recruiterId?.company?.name || job.recruiterId?.name || "Recruiter";
  const mode = job.workMode === "remote" ? "Remote" : job.workMode === "hybrid" ? "Hybrid" : "On-site";

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-h2 text-dark">{job.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-slate-600">
              <span className="font-medium text-slate-800">{company}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                {job.location || "Location TBD"}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{mode}</span>
            </p>
          </div>
          <Link to="/jobs" className="btn-secondary min-h-[2.5rem] shrink-0 px-4 py-2 text-small">
            Back to jobs
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-small text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Salary</span>
            <p className="mt-1 flex items-center gap-1 font-semibold text-dark">
              <IndianRupee className="h-4 w-4 text-slate-500" />
              {job.salaryMax ? `₹${job.salaryMin || 0} – ₹${job.salaryMax}` : "Not disclosed"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-small text-slate-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</span>
            <p className="mt-1 flex items-center gap-1 font-semibold text-dark">
              <Briefcase className="h-4 w-4 text-slate-500" />
              {job.experienceLevel || "—"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</h2>
          <div className="mt-2 whitespace-pre-wrap text-body text-slate-700">{job.description}</div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Required skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {(job.requiredSkills || []).length ? (
              job.requiredSkills.map((s) => (
                <span key={s} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-800 shadow-sm">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-small text-slate-500">—</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          {!isAuthed ? (
            <Link
              to="/login"
              state={{ from: `/jobs/${id}` }}
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-primary px-6 text-small font-semibold text-white transition hover:bg-blue-700"
            >
              Login to apply
            </Link>
          ) : canApply ? (
            <>
              <button
                disabled={busy}
                onClick={apply}
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-primary px-6 text-small font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {busy ? "Applying…" : "Apply now"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={toggleSave}
                className={[
                  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border px-5 text-small font-semibold transition",
                  saved
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/30",
                ].join(" ")}
              >
                <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Saved" : "Save job"}
              </button>
            </>
          ) : (
            <p className="text-small text-slate-600">Only candidates can apply to jobs.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
