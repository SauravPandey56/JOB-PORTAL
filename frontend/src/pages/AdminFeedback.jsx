import { useCallback, useEffect, useState, useRef } from "react";
import { RefreshCw, CheckCircle, Trash2, Search, MoreVertical, Reply, Inbox as InboxIcon } from "lucide-react";
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

function FeedbackActionsDropdown({ f, busy, resolve, del }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  const reply = () => {
    toast.success("Opening reply modal (mock UI)");
    setOpen(false);
  };

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
          {f.status !== "resolved" && (
            <button
              disabled={busy === f._id}
              onClick={() => { resolve(f._id); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Resolved
            </button>
          )}

          <button onClick={reply} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left">
            <Reply className="h-4 w-4 text-indigo-500" /> Reply via Email
          </button>

          <div className="my-1 h-px bg-slate-100" />

          <button
            disabled={busy === f._id}
            onClick={() => { del(f._id); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 w-full text-left"
          >
            <Trash2 className="h-4 w-4" /> Delete Feedback
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
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
    if (!window.confirm("Delete this feedback permanently?")) return;
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

  const filteredItems = items.filter(f => {
    if(!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (f.name || "anonymous").toLowerCase();
    const email = (f.email || "").toLowerCase();
    const msg = (f.message || "").toLowerCase();
    return name.includes(q) || email.includes(q) || msg.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Feedback Inbox</h1>
          <p className="mt-1 text-sm text-slate-500">Manage support inquiries, bug reports, and user feedback.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="flex flex-1 items-center gap-2">
           <div className="relative flex-1 max-w-sm ml-2">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by name, email, or message..."
               className="w-full rounded-xl border-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
             />
           </div>
           
           <div className="relative">
             <select
               className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
               value={status}
               onChange={(e) => setStatus(e.target.value)}
             >
               <option value="">All Statuses</option>
               <option value="new">New (Unresolved)</option>
               <option value="resolved">Resolved</option>
             </select>
             <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
             </div>
           </div>
        </div>
        
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Inbox
        </button>
      </div>

      {/* Table view */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">User Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Email Address</th>
                <th className="px-6 py-4">Message Preview</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Date Received</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
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
                    <div className="flex flex-col items-center justify-center">
                       <InboxIcon className="h-8 w-8 text-slate-300 mb-2" />
                       <p>Inbox is empty.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((f) => (
                  <tr key={f._id} className="transition hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="font-semibold text-slate-900">{f.name || "Anonymous User"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                       {f.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-slate-700 line-clamp-2 min-w-[200px] text-xs leading-relaxed">{f.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {f.status === "resolved" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                             <CheckCircle className="h-3 w-3" /> Resolved
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
                             <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span> New
                          </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {f.createdAt ? new Date(f.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                       <FeedbackActionsDropdown f={f} busy={busy} resolve={resolve} del={del} />
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
