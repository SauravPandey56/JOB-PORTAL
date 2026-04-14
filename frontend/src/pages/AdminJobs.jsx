import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Ban, Flag, FlagOff, Trash2, ChevronLeft, ChevronRight, RefreshCw, MoreVertical, Briefcase, MapPin } from "lucide-react";
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

function JobActionsDropdown({ j, busy, disable, flag, hardDelete }) {
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
            to={`/jobs/${j._id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
          >
            <Eye className="h-4 w-4 text-slate-400" /> View Live Job
          </Link>

          {j.isActive ? (
            <button
              disabled={busy === j._id}
              onClick={() => { disable(j._id); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 w-full text-left"
            >
              <Ban className="h-4 w-4 text-amber-500" /> Suspend Job
            </button>
          ) : null}

          {j.isFlagged ? (
            <button
              disabled={busy === j._id}
              onClick={() => { flag(j._id, false); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
            >
              <FlagOff className="h-4 w-4 text-slate-400" /> Remove Flag
            </button>
          ) : (
            <button
              disabled={busy === j._id}
              onClick={() => { flag(j._id, true); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 w-full text-left"
            >
              <Flag className="h-4 w-4 text-amber-500" /> Flag Job
            </button>
          )}

          <div className="my-1 h-px bg-slate-100" />

          <button
            disabled={busy === j._id}
            onClick={() => { hardDelete(j._id); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 w-full text-left"
          >
            <Trash2 className="h-4 w-4" /> Delete Job
          </button>
        </div>
      )}
    </div>
  );
}

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Job Postings</h1>
          <p className="mt-1 text-sm text-slate-500">Moderate all active listings and applicant volume.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Req. Setup</th>
                <th className="px-6 py-4">Volume</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary mx-auto" />
                   </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No jobs found in the system.
                  </td>
                </tr>
              ) : (
                items.map((j) => (
                  <tr key={j._id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                           <Briefcase className="h-5 w-5" />
                         </div>
                         <div>
                           <p className="max-w-[220px] truncate font-semibold text-slate-900">{j.title}</p>
                           <p className="text-xs text-slate-500 inline-flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {j.location || (j.recruiterId?.company?.location || "Remote")}
                           </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{j.recruiterId?.company?.name || "Unknown Co."}</p>
                      <p className="text-xs text-slate-500">by {j.recruiterId?.name || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                         {j.jobType || "Full-time"}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                         {j.applicantCount ?? 0} Applys
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      {j.isFlagged ? (
                         <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase text-amber-800 tracking-wide ring-1 ring-amber-600/20">Flagged</span>
                      ) : !j.isActive ? (
                         <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase text-slate-700 ring-1 ring-slate-500/20">Closed</span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <JobActionsDropdown j={j} busy={busy} disable={disable} flag={flag} hardDelete={hardDelete} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && (
           <div className="flex flex-col items-center justify-between border-t border-slate-100 bg-white px-6 py-4 sm:flex-row">
             <span className="text-sm text-slate-500 mb-4 sm:mb-0">
               Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{pages}</span> · <span className="font-medium text-slate-900">{total}</span> total jobs
             </span>
             <div className="flex items-center gap-2">
               <button
                 type="button"
                 disabled={page <= 1}
                 onClick={() => setPage((p) => Math.max(1, p - 1))}
                 className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
               >
                 <ChevronLeft className="h-4 w-4" />
               </button>
               <button
                 type="button"
                 disabled={page >= pages}
                 onClick={() => setPage((p) => Math.min(pages, p + 1))}
                 className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
               >
                 <ChevronRight className="h-4 w-4" />
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
