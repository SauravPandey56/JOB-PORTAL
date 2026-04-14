import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RefreshCw, Search, Filter, MoreVertical, Eye, XCircle, UserX, FileText } from "lucide-react";
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

function ApplicationActionsDropdown({ a }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  const reject = () => { toast.error("Application rejected (mock API)"); setOpen(false); };
  const blacklist = () => { toast.error("Candidate blacklisted (mock API)"); setOpen(false); };
  const viewResume = () => { toast.success("Opening resume viewer (mock API)"); setOpen(false); };

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
          <button onClick={viewResume} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
            <FileText className="h-4 w-4 text-indigo-500" /> View Resume
          </button>
          
          <div className="my-1 h-px bg-slate-100" />

          <button onClick={reject} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left">
            <XCircle className="h-4 w-4 text-rose-500" /> Reject Application
          </button>

          <button onClick={blacklist} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
            <UserX className="h-4 w-4 text-slate-500" /> Blacklist Candidate
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Real filters plus local search
  const [jobFilter, setJobFilter] = useState(searchParams.get("jobId") || "");
  const [recFilter, setRecFilter] = useState(searchParams.get("recruiterId") || "");
  const [candFilter, setCandFilter] = useState(searchParams.get("candidateId") || "");
  const [localSearch, setLocalSearch] = useState("");

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

  const filteredItems = items.filter(a => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    const cname = (a.candidateId?.name || "").toLowerCase();
    const jtitle = (a.jobId?.title || "").toLowerCase();
    const comp = (a.jobId?.recruiterId?.company?.name || "").toLowerCase();
    return cname.includes(q) || jtitle.includes(q) || comp.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor candidate pipeline and application statuses globally.</p>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={applyFilters} className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
             <div className="relative">
               <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidate ID</label>
               <input
                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                 value={candFilter} onChange={(e) => setCandFilter(e.target.value)} placeholder="Filter by candidate"
               />
             </div>
             <div className="relative">
               <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Recruiter ID</label>
               <input
                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                 value={recFilter} onChange={(e) => setRecFilter(e.target.value)} placeholder="Filter by recruiter"
               />
             </div>
             <div className="relative">
               <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wide">Job ID</label>
               <input
                 className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                 value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} placeholder="Filter by job ID"
               />
             </div>
          </div>
          <div className="flex gap-2 shrink-0">
             <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
               <Filter className="h-4 w-4" /> Apply API Filters
             </button>
             <button
               type="button"
               onClick={() => {
                 setJobFilter(""); setRecFilter(""); setCandFilter("");
                 setSearchParams({}); setPage(1);
               }}
               className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
             >
               Reset
             </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-md ml-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Quick search loaded candidates, jobs, or companies..."
            className="w-full rounded-xl border-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button type="button" onClick={() => load()} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh Base Data
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Applied For Job</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submission Date</th>
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
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No applications matched your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((a) => {
                  const job = a.jobId;
                  const cand = a.candidateId;
                  const company = job?.recruiterId?.company?.name || "—";
                  
                  // Status styler
                  const getStatusStyle = (s) => {
                    const st = s?.toLowerCase();
                    if(st === "hired" || st === "accepted") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
                    if(st === "rejected") return "bg-rose-50 text-rose-700 ring-rose-600/20";
                    if(st === "interview") return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";
                    return "bg-slate-100 text-slate-700 ring-slate-500/10";
                  };

                  return (
                    <tr key={a._id} className="transition hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                             {(cand?.name || "U").substring(0, 2)}
                           </div>
                           <div>
                              <p className="font-semibold text-slate-900">{cand?.name || "Unknown Candidate"}</p>
                              <p className="text-xs text-slate-500">{cand?.email || "—"}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px] truncate">
                           {job?._id ? (
                             <Link to={`/jobs/${job._id}`} className="font-medium text-primary hover:underline">{job.title}</Link>
                           ) : (
                             <span className="text-slate-500">Deleted Job</span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{company}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {a.appliedDate ? new Date(a.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <ApplicationActionsDropdown a={a} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && (
           <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
             <span className="text-sm text-slate-500">
               Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{pages}</span> · <span className="font-medium text-slate-900">{total}</span> global applications
             </span>
             <div className="flex gap-2">
               <button
                 type="button"
                 disabled={page <= 1}
                 onClick={() => setPage((p) => p - 1)}
                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
               >
                 Prev
               </button>
               <button
                 type="button"
                 disabled={page >= pages}
                 onClick={() => setPage((p) => p + 1)}
                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
               >
                 Next
               </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
