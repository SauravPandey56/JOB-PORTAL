import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function CandidateSavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/users/me/saved-jobs")
      .then((res) => alive && setJobs(res.data.jobs || []))
      .catch(() => toast.error("Could not load saved jobs"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/users/me/saved-jobs/${id}`);
      setJobs((j) => j.filter((x) => String(x._id) !== String(id)));
      toast.success("Removed");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <h1 className="text-h2 text-dark">Saved jobs</h1>
      <p className="mt-1 text-sm text-slate-600">Roles you bookmarked from search.</p>

      {loading ? (
        <GlassCard className="mt-6 p-8 text-center text-slate-600">Loading…</GlassCard>
      ) : jobs.length === 0 ? (
        <GlassCard className="mt-6 p-8 text-center text-slate-600">
          No saved jobs yet.{" "}
          <Link to="/jobs" className="font-semibold text-primary hover:underline">
            Browse jobs
          </Link>
        </GlassCard>
      ) : (
        <ul className="mt-6 space-y-3">
          {jobs.map((j) => (
            <li key={j._id}>
              <GlassCard className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link to={`/jobs/${j._id}`} className="font-semibold text-primary hover:underline">
                    {j.title}
                  </Link>
                  <p className="text-sm text-slate-600">{j.location || "—"}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/jobs/${j._id}`} className="btn-secondary min-h-[2.5rem] px-4 py-2 text-sm">
                    Open
                  </Link>
                  <button type="button" onClick={() => remove(j._id)} className="btn-secondary min-h-[2.5rem] px-4 py-2 text-sm text-rose-700">
                    Remove
                  </button>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
