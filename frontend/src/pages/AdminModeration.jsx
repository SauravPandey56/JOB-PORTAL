import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Ban, Eye, FlagOff, UserCheck, ShieldAlert, CheckCircle, Search, AlertCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
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
      toast.success("Moderation action applied");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const flaggedJobsCount = data?.flaggedJobs?.length || 0;
  const pendingRecCount = data?.pendingRecruiters?.length || 0;
  const flaggedUsersCount = data?.flaggedUsers?.length || 0;
  const totalItems = flaggedJobsCount + pendingRecCount + flaggedUsersCount;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Moderation Center</h1>
          <p className="mt-1 text-sm text-slate-500">Handle flagged content, reported users, and pending approvals.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Queue
        </button>
      </div>

      {!loading && totalItems === 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center flex flex-col items-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-emerald-900">All caught up!</h3>
            <p className="text-sm text-emerald-700 mt-1">The moderation queue is entirely clear.</p>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center">
           <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
           <p className="text-sm text-slate-500 font-medium">Loading moderation queues...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Flagged Jobs Section */}
          {flaggedJobsCount > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-3">
                 <AlertCircle className="h-5 w-5 text-amber-500" />
                 <h2 className="text-lg font-bold text-slate-900">Reported Jobs</h2>
                 <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">{flaggedJobsCount}</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Flagged Job</th>
                        <th className="px-6 py-4">Posted By</th>
                        <th className="px-6 py-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.flaggedJobs.map((j) => (
                        <tr key={j._id} className="transition hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                             <p className="font-semibold text-rose-700">{j.title}</p>
                             <p className="text-xs text-slate-500 mt-0.5">ID: {j._id}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">{j.recruiterId?.name || "Unknown"}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 text-xs">
                              <Link
                                to={`/jobs/${j._id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium transition hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" /> Review
                              </Link>
                              <button
                                type="button"
                                disabled={busy === j._id}
                                onClick={() => {
                                  setBusy(j._id);
                                  run(() => api.post(`/admin/jobs/${j._id}/unflag`));
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4" /> Keep / Unflag
                              </button>
                              <button
                                type="button"
                                disabled={busy === j._id}
                                onClick={() => {
                                  setBusy(j._id);
                                  run(() => api.post(`/admin/jobs/${j._id}/remove`));
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" /> Remove Job
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Pending Verify Section */}
          {pendingRecCount > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center gap-2 mb-3">
                 <UserCheck className="h-5 w-5 text-blue-500" />
                 <h2 className="text-lg font-bold text-slate-900">Pending Recruiter Approvals</h2>
                 <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">{pendingRecCount}</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Account Applicant</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.pendingRecruiters.map((u) => (
                        <tr key={u._id} className="transition hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold uppercase text-slate-500">
                                {u.name.substring(0, 2)}
                              </div>
                              <span className="font-semibold text-slate-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{u.email}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  disabled={busy === u._id}
                                  onClick={() => {
                                    setBusy(u._id);
                                    run(() => api.post(`/admin/users/${u._id}/verify-recruiter`));
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                  <CheckCircle className="h-4 w-4" /> Approve Identity
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Flagged Users Section */}
          {flaggedUsersCount > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="flex items-center gap-2 mb-3">
                 <ShieldAlert className="h-5 w-5 text-rose-500" />
                 <h2 className="text-lg font-bold text-slate-900">Reported Users</h2>
                 <span className="ml-2 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">{flaggedUsersCount}</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Account</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.flaggedUsers.map((u) => (
                        <tr key={u._id} className="transition hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-rose-700">{u.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                          </td>
                          <td className="px-6 py-4 capitalize font-medium text-slate-700">{u.role}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 text-xs">
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => {
                                  setBusy(u._id);
                                  run(() => api.post(`/admin/users/${u._id}/unflag`));
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:opacity-50"
                              >
                                <FlagOff className="h-4 w-4" /> Clear Flag
                              </button>
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => {
                                  setBusy(u._id);
                                  run(() => api.post(`/admin/users/${u._id}/block`));
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                              >
                                <Ban className="h-4 w-4" /> Suspend User
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
