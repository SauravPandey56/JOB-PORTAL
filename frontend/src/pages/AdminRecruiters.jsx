import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, UserCheck, Ban, Eye } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminRecruiters() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/recruiters");
      setRows(res.data.recruiters || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const verify = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/users/${id}/verify-recruiter`);
      toast.success("Recruiter approved");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const suspend = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/users/${id}/block`);
      toast.success("Suspended");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recruiters</h1>
          <p className="text-sm text-slate-600">Verify accounts, review hiring volume, and suspend when needed.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
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
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Jobs</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      No recruiters yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.email}</div>
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-slate-600">{r.company || "—"}</td>
                      <td className="px-4 py-3 tabular-nums">{r.jobsPosted}</td>
                      <td className="px-4 py-3 tabular-nums">{r.applicants}</td>
                      <td className="px-4 py-3">
                        {r.recruiterVerified ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Verified</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">Pending</span>
                        )}
                        {r.isBlocked ? <span className="ml-1 text-xs text-rose-600">· Suspended</span> : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            to={`/admin/users?role=recruiter`}
                            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Directory
                          </Link>
                          {!r.recruiterVerified ? (
                            <button
                              type="button"
                              disabled={busy === r._id}
                              onClick={() => verify(r._id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          ) : null}
                          {!r.isBlocked ? (
                            <button
                              type="button"
                              disabled={busy === r._id}
                              onClick={() => suspend(r._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Suspend
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
