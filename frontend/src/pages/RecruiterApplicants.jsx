import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

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

export default function RecruiterApplicants() {
  const { jobId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get(`/applications/job/${jobId}`)
      .then((res) => setItems(res.data.applications || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!jobId) return;
    load();
  }, [jobId]);

  const setStatus = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    toast.success("Updated");
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Applicants</h2>
        <Link to="/recruiter/jobs" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
          Back
        </Link>
      </div>
      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-6">No applicants yet.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <GlassCard key={a._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{a.candidateId?.name || "Candidate"}</div>
                  <div className="mt-1 text-xs text-slate-300">{a.candidateId?.email}</div>
                  <div className="mt-2 text-xs text-slate-300">
                    Skills: {(a.candidateId?.skills || []).join(", ") || "-"}
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    Qualification: {a.candidateId?.qualification || "-"}
                  </div>
                  <div className="mt-2">
                    {a.candidateId?.resume?.url ? (
                      <a
                        className="text-sm text-sky-400 hover:text-sky-300"
                        href={`http://localhost:5000${a.candidateId.resume.url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download resume
                      </a>
                    ) : (
                      <span className="text-sm text-slate-300">No resume</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {badge(a.status)}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus(a._id, "shortlisted")}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/15"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => setStatus(a._id, "rejected")}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

