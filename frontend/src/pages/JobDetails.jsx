import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import toast from "react-hot-toast";

export default function JobDetails() {
  const { id } = useParams();
  const { isAuthed, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

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

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <GlassCard className="p-6">Loading...</GlassCard>
      </div>
    );
  }
  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <GlassCard className="p-6">Job not found.</GlassCard>
      </div>
    );
  }

  const canApply = isAuthed && user?.role === "candidate";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-h2 text-dark">{job.title}</h2>
            <p className="mt-1 text-small text-slate-600">
              {job.recruiterId?.company?.name || job.recruiterId?.name || "Recruiter"} ·{" "}
              {job.location || "Remote"}
            </p>
          </div>
          <Link to="/jobs" className="btn-secondary min-h-[2.5rem] px-4 py-2 text-small">
            Back
          </Link>
        </div>

        <div className="mt-4 whitespace-pre-wrap text-body text-slate-700">{job.description}</div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 text-small text-slate-600">
          <div>Category: {job.category || "-"}</div>
          <div>Experience: {job.experienceLevel || "-"}</div>
          <div>
            Salary:{" "}
            {job.salaryMax ? `₹${job.salaryMin || 0} - ₹${job.salaryMax}` : "Not disclosed"}
          </div>
          <div>Skills: {job.requiredSkills?.length ? job.requiredSkills.join(", ") : "-"}</div>
        </div>

        <div className="mt-6">
          {!isAuthed ? (
            <Link
              to="/login"
              state={{ from: `/jobs/${id}` }}
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-primary px-5 text-small font-semibold text-white transition hover:bg-accent"
            >
              Login to apply
            </Link>
          ) : canApply ? (
            <button
              disabled={busy}
              onClick={apply}
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-primary px-5 text-small font-semibold text-white transition hover:bg-accent disabled:opacity-50"
            >
              {busy ? "Applying…" : "Apply now"}
            </button>
          ) : (
            <p className="text-small text-slate-600">Only candidates can apply to jobs.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

