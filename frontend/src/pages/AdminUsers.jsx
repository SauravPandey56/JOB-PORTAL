import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [role, setRole] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/users", { params: role ? { role } : {} })
      .then((res) => setItems(res.data.users || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [role]);

  const block = async (id) => {
    await api.post(`/admin/users/${id}/block`);
    toast.success("Blocked");
    load();
  };
  const unblock = async (id) => {
    await api.post(`/admin/users/${id}/unblock`);
    toast.success("Unblocked");
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Users</h2>
        <select
          className="rounded-xl bg-slate-900/60 border-white/10"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All</option>
          <option value="recruiter">Recruiters</option>
          <option value="candidate">Job seekers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <GlassCard className="p-6">Loading...</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-6">No users.</GlassCard>
      ) : (
        <div className="grid gap-3">
          {items.map((u) => (
            <GlassCard key={u._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {u.name} <span className="text-xs text-slate-300">· {u.role}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  {u.isBlocked ? (
                    <>
                      <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-xs text-rose-200">
                        blocked
                      </span>
                      <button
                        onClick={() => unblock(u._id)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        Unblock
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => block(u._id)}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

