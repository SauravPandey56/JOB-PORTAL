import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Ban, Flag, FlagOff, Trash2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminJobs() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/jobs", { params: { page, limit } });
      setItems(res.data.items || []);
      setPages(res.data.pages ?? 1);
      setTotal(res.data.total ?? 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const disable = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/jobs/${id}/remove`);
      toast.success("Job disabled");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const flag = async (id, on) => {
    setBusy(id);
    try {
      await api.post(on ? `/admin/jobs/${id}/flag` : `/admin/jobs/${id}/unflag`);
      toast.success(on ? "Flagged" : "Unflagged");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const hardDelete = async (id) => {
    if (!window.confirm("Permanently delete this job and its applications?")) return;
    setBusy(id);
    try {
      await api.delete(`/admin/jobs/${id}/delete`);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const statusBadge = (j) => {
    if (j.isFlagged) return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-600/15">Flagged</span>;
    if (!j.isActive) return <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-500/10">Closed</span>;
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">Active</span>;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-600">Moderate listings, flags, and applicant volume.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <GlassCard className="p-8 text-center">Loading…</GlassCard>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No jobs.
                    </td>
                  </tr>
                ) : (
                  items.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-50/80">
                      <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-900">{j.title}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-slate-600">{j.recruiterId?.company?.name || "—"}</td>
                      <td className="max-w-[120px] truncate px-4 py-3 text-slate-600">{j.recruiterId?.name || "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-slate-700">{j.applicantCount ?? 0}</td>
                      <td className="px-4 py-3">{statusBadge(j)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            to={`/jobs/${j._id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          {j.isFlagged ? (
                            <button
                              type="button"
                              disabled={busy === j._id}
                              onClick={() => flag(j._id, false)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                            >
                              <FlagOff className="h-3.5 w-3.5" />
                              Unflag
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy === j._id}
                              onClick={() => flag(j._id, true)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                            >
                              <Flag className="h-3.5 w-3.5" />
                              Flag
                            </button>
                          )}
                          {j.isActive ? (
                            <button
                              type="button"
                              disabled={busy === j._id}
                              onClick={() => disable(j._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Disable
                            </button>
                          ) : null}
                          <button
                            type="button"
                            disabled={busy === j._id}
                            onClick={() => hardDelete(j._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm sm:flex-row">
            <span>
              Page {page} of {pages} · {total} jobs
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
