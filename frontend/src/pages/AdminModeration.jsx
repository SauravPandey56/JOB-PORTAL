import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Ban, Eye, FlagOff, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminModeration() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/moderation");
      setData(res.data);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn) => {
    try {
      await fn();
      toast.success("Updated");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Moderation</h1>
          <p className="text-sm text-slate-600">Flagged jobs, pending recruiters, and reported accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading || !data ? (
        <GlassCard className="p-8 text-center">Loading…</GlassCard>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Reported / flagged jobs</h2>
            <GlassCard className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Job</th>
                      <th className="px-4 py-3">Recruiter</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!(data.flaggedJobs || []).length ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          No flagged jobs.
                        </td>
                      </tr>
                    ) : (
                      data.flaggedJobs.map((j) => (
                        <tr key={j._id}>
                          <td className="px-4 py-3 font-medium text-slate-900">{j.title}</td>
                          <td className="px-4 py-3 text-slate-600">{j.recruiterId?.name || "—"}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Link
                                to={`/jobs/${j._id}`}
                                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Review
                              </Link>
                              <button
                                type="button"
                                disabled={busy === j._id}
                                onClick={() => {
                                  setBusy(j._id);
                                  run(() => api.post(`/admin/jobs/${j._id}/unflag`));
                                }}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                              >
                                <FlagOff className="inline h-3.5 w-3.5" /> Clear
                              </button>
                              <button
                                type="button"
                                disabled={busy === j._id}
                                onClick={() => {
                                  setBusy(j._id);
                                  run(() => api.post(`/admin/jobs/${j._id}/remove`));
                                }}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800 disabled:opacity-50"
                              >
                                Disable
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Pending recruiter verification</h2>
            <GlassCard className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!(data.pendingRecruiters || []).length ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          No pending recruiters.
                        </td>
                      </tr>
                    ) : (
                      data.pendingRecruiters.map((u) => (
                        <tr key={u._id}>
                          <td className="px-4 py-3 font-medium">{u.name}</td>
                          <td className="px-4 py-3 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              disabled={busy === u._id}
                              onClick={() => {
                                setBusy(u._id);
                                run(() => api.post(`/admin/users/${u._id}/verify-recruiter`));
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Flagged users</h2>
            <GlassCard className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!(data.flaggedUsers || []).length ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          No flagged users.
                        </td>
                      </tr>
                    ) : (
                      data.flaggedUsers.map((u) => (
                        <tr key={u._id}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-4 py-3 capitalize">{u.role}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => {
                                  setBusy(u._id);
                                  run(() => api.post(`/admin/users/${u._id}/unflag`));
                                }}
                                className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                              >
                                Clear flag
                              </button>
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => {
                                  setBusy(u._id);
                                  run(() => api.post(`/admin/users/${u._id}/block`));
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800 disabled:opacity-50"
                              >
                                <Ban className="h-3.5 w-3.5" />
                                Suspend
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>
        </>
      )}
    </div>
  );
}
