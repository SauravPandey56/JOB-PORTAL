import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function CandidateNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/users/me/notifications")
      .then((res) => setItems(res.data.notifications || []))
      .catch(() => toast.error("Could not load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/users/me/notifications/${id}/read`);
      setItems((list) => list.map((n) => (String(n._id) === String(id) ? { ...n, read: true } : n)));
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-h2 text-dark">Notifications</h1>
      <p className="mt-1 text-sm text-slate-600">Application updates and system messages.</p>

      {loading ? (
        <GlassCard className="mt-6 p-8 text-center">Loading…</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="mt-6 p-8 text-center text-slate-600">You’re all caught up.</GlassCard>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((n) => (
            <li key={n._id}>
              <GlassCard className={`p-4 ${n.read ? "opacity-80" : "border-primary/20 bg-primary/[0.03]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-dark">{n.title}</p>
                    {n.body ? <p className="mt-1 text-sm text-slate-600">{n.body}</p> : null}
                    <p className="mt-2 text-xs text-slate-400">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</p>
                  </div>
                  {!n.read ? (
                    <button type="button" onClick={() => markRead(n._id)} className="text-sm font-semibold text-primary hover:underline">
                      Mark read
                    </button>
                  ) : null}
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
