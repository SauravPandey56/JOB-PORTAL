import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, UserCheck, Ban, Eye, MoreVertical, Building2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api.js";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function RecruiterActionsDropdown({ r, busy, verify, suspend }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <Link
            to={`/admin/users?role=recruiter`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
          >
            <Eye className="h-4 w-4 text-slate-400" /> View Directory
          </Link>
          
          {!r.recruiterVerified && (
            <button
              disabled={busy === r._id}
              onClick={() => { verify(r._id); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
            >
              <UserCheck className="h-4 w-4 text-emerald-500" /> Approve Recruiter
            </button>
          )}

          {!r.isBlocked && (
            <button
              disabled={busy === r._id}
              onClick={() => { suspend(r._id); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 w-full text-left pt-2 pb-2 border-t border-slate-100 mt-1"
            >
              <Ban className="h-4 w-4" /> Suspend Account
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminRecruiters() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/recruiters");
      setRows(res.data.recruiters || []);
      setFilteredRows(res.data.recruiters || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredRows(rows);
      return;
    }
    const q = search.toLowerCase();
    setFilteredRows(rows.filter((r) => 
      r.name?.toLowerCase().includes(q) || 
      r.email?.toLowerCase().includes(q) || 
      r.company?.toLowerCase().includes(q)
    ));
  }, [search, rows]);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Recruiters</h1>
          <p className="mt-1 text-sm text-slate-500">Verify accounts, review hiring volume, and manage access.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-sm ml-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or recruiter..."
            className="w-full rounded-xl border-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Recruiter Info</th>
                <th className="px-6 py-4">Jobs Posted</th>
                <th className="px-6 py-4">Total Applicants</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No recruiters found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r._id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Building2 className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="font-semibold text-slate-900">{r.company || "Pending Setup"}</p>
                            <p className="text-xs text-slate-500 max-w-[120px] truncate">{r.website || "—"}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.email}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 tabular-nums">
                         {r.jobsPosted ?? 0} Listed
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 tabular-nums">
                         {r.applicants ?? 0} Candidates
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${r.recruiterVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className={`text-xs font-semibold ${r.recruiterVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                           {r.recruiterVerified ? 'Verified' : 'Pending'}
                        </span>
                        {r.isBlocked && <span className="ml-2 inline-flex rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-700">Suspended</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <RecruiterActionsDropdown r={r} busy={busy} verify={verify} suspend={suspend} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
