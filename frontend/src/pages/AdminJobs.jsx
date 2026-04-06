import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export default function AdminJobs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/jobs", { params: { page: 1, limit: 30 } })
      .then((res) => setItems(res.data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await api.post(`/admin/jobs/${id}/remove`);
    toast.success("Deactivated");
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">Jobs moderation</h2>
      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-6">No jobs.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {items.map((j) => (
            <GlassCard key={j._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="mt-1 text-xs text-slate-300">
                    {j.recruiterId?.company?.name || j.recruiterId?.name || "Recruiter"} ·{" "}
                    {j.location || "-"}
                  </div>
                </div>
                <button
                  onClick={() => remove(j._id)}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15"
                >
                  Deactivate
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

