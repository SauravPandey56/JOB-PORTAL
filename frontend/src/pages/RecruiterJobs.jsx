import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/jobs/mine")
      .then((res) => setJobs(res.data.jobs || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">My jobs</h2>
        <Link
          to="/recruiter/jobs/new"
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
        >
          New job
        </Link>
      </div>
      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : jobs.length === 0 ? (
        <GlassCard className="p-6">No jobs yet.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {jobs.map((j) => (
            <GlassCard key={j._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="mt-1 text-xs text-slate-300">
                    {j.category || "-"} · {j.location || "-"} · {j.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/recruiter/jobs/${j._id}/edit`}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/recruiter/jobs/${j._id}/applicants`}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    Applicants
                  </Link>
                  <button
                    onClick={() => del(j._id)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

