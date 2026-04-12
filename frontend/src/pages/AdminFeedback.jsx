import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/feedback", { params: status ? { status } : {} });
      setItems(res.data.feedback || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const resolve = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/feedback/${id}/resolve`);
      toast.success("Marked resolved");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setBusy(id);
    try {
      await api.delete(`/admin/feedback/${id}`);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-600">Inbox from the public feedback form on the marketing site.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <GlassCard className="p-8 text-center">Loading…</GlassCard>
      ) : items.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-500">No messages yet.</GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <GlassCard key={f._id} className="p-5 transition hover:shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{f.name || "Anonymous"}</span>
                    <span className="text-sm text-slate-500">{f.email}</span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        f.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800",
                      ].join(" ")}
                    >
                      {f.status === "resolved" ? "Resolved" : "New"}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{f.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {f.status !== "resolved" ? (
                    <button
                      type="button"
                      disabled={busy === f._id}
                      onClick={() => resolve(f._id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Resolve
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy === f._id}
                    onClick={() => del(f._id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
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
