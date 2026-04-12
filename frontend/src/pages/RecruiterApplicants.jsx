import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
  { value: "selected", label: "Selected" },
];

const badge = (status) => {
  const map = {
    applied: "bg-sky-500/15 text-sky-200 border-sky-500/30",
    under_review: "bg-slate-500/15 text-slate-200 border-slate-500/30",
    shortlisted: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    interview: "bg-violet-500/15 text-violet-200 border-violet-500/30",
    rejected: "bg-rose-500/15 text-rose-200 border-rose-500/30",
    selected: "bg-emerald-600/20 text-emerald-100 border-emerald-500/40",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${map[status] || "border-white/10 bg-white/5"}`}>
      {(status || "").replaceAll("_", " ")}
    </span>
  );
};

export default function RecruiterApplicants() {
  const { jobId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

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
    setBusyId(id);
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success("Status updated");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Applicants</h2>
        <Link
          to="/recruiter/jobs"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          Back
        </Link>
      </div>
      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-6">No applicants yet.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => {
            const resumePath = a.candidateId?.resume?.url;
            const resumeUrl = resumePath ? (resumePath.startsWith("http") ? resumePath : `${API_ORIGIN}${resumePath}`) : null;
            return (
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
                      {resumeUrl ? (
                        <a
                          className="text-sm text-sky-400 hover:text-sky-300"
                          href={resumeUrl}
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
                    <label className="sr-only" htmlFor={`status-${a._id}`}>
                      Update status for {a.candidateId?.name || "candidate"}
                    </label>
                    <select
                      id={`status-${a._id}`}
                      disabled={busyId === a._id}
                      value={a.status || "applied"}
                      onChange={(e) => setStatus(a._id, e.target.value)}
                      className="rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none ring-primary/30 focus:ring-2 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
