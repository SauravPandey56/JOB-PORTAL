import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState(searchParams.get("jobId") || "");
  const [recFilter, setRecFilter] = useState(searchParams.get("recruiterId") || "");
  const [candFilter, setCandFilter] = useState(searchParams.get("candidateId") || "");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/applications", {
        params: {
          page,
          limit: 20,
          jobId: jobFilter || undefined,
          recruiterId: recFilter || undefined,
          candidateId: candFilter || undefined,
        },
      });
      setItems(res.data.applications || []);
      setPages(res.data.pages ?? 1);
      setTotal(res.data.total ?? 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [page, jobFilter, recFilter, candFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    const next = new URLSearchParams();
    if (jobFilter) next.set("jobId", jobFilter);
    if (recFilter) next.set("recruiterId", recFilter);
    if (candFilter) next.set("candidateId", candFilter);
    setSearchParams(next);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-600">Monitor candidate pipeline across jobs and recruiters.</p>
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

      <GlassCard className="p-4">
        <form onSubmit={applyFilters} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-slate-500">Job ID</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              placeholder="Mongo ObjectId"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Recruiter user ID</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={recFilter}
              onChange={(e) => setRecFilter(e.target.value)}
              placeholder="Recruiter ObjectId"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Candidate user ID</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={candFilter}
              onChange={(e) => setCandFilter(e.target.value)}
              placeholder="Candidate ObjectId"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
              Apply filters
            </button>
            <button
              type="button"
              onClick={() => {
                setJobFilter("");
                setRecFilter("");
                setCandFilter("");
                setSearchParams({});
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <GlassCard className="p-8 text-center">Loading…</GlassCard>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No applications.
                    </td>
                  </tr>
                ) : (
                  items.map((a) => {
                    const job = a.jobId;
                    const cand = a.candidateId;
                    const company = job?.recruiterId?.company?.name || "—";
                    return (
                      <tr key={a._id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{cand?.name || "—"}</div>
                          <div className="text-xs text-slate-500">{cand?.email}</div>
                        </td>
                        <td className="max-w-[200px] px-4 py-3">
                          {job?._id ? (
                            <Link to={`/jobs/${job._id}`} className="font-medium text-primary hover:underline">
                              {job.title}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="max-w-[160px] truncate px-4 py-3 text-slate-600">{company}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-800">
                            {a.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {a.appliedDate ? new Date(a.appliedDate).toLocaleString() : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
            <span>
              Page {page} of {pages} · {total} total
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
