import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

const badge = (status) => {
  const map = {
    applied: "bg-sky-500/15 text-sky-200 border-sky-500/30",
    shortlisted: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    rejected: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${map[status] || "border-white/10 bg-white/5"}`}>
      {status}
    </span>
  );
};

export default function CandidateApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/applications/me")
      .then((res) => alive && setItems(res.data.applications || []))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">My applications</h2>
      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-6">No applications yet.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <GlassCard key={a._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{a.jobId?.title || "Job"}</div>
                  <div className="mt-1 text-xs text-slate-300">
                    {a.jobId?.recruiterId?.company?.name || a.jobId?.recruiterId?.name || "Recruiter"} ·{" "}
                    {a.jobId?.location || "-"}
                  </div>
                </div>
                {badge(a.status)}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

