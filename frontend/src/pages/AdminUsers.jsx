import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, ChevronLeft, ChevronRight, Eye, Ban, Trash2, Pencil, KeyRound, 
  RefreshCw, Flag, FlagOff, MoreVertical, ArrowUpRight 
} from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

function normalizeRoleParam(raw) {
  const r = (raw || "").toString().trim();
  return ["recruiter", "candidate", "admin"].includes(r) ? r : "";
}

function roleBadge(role) {
  if (role === "admin") return "bg-violet-50 text-violet-700 ring-violet-600/20";
  if (role === "recruiter") return "bg-sky-50 text-sky-700 ring-sky-600/20";
  return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
}

function formatRole(role) {
  if (role === "admin") return "Admin";
  if (role === "recruiter") return "Recruiter";
  if (role === "candidate") return "Candidate";
  return role || "—";
}

// Custom hook for clicking outside a dropdown
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

// Action Dropdown component for cleaner UI
function UserActionsDropdown({ u, busy, setEditUser, setEditForm, setPwdUser, block, unblock, del, promoteToRecruiter, toggleFlag }) {
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
            to={u.role === "candidate" ? "/candidate" : "/dashboard"}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
          >
            <Eye className="h-4 w-4 text-slate-400" /> View Profile
          </Link>
          <button
            onClick={() => { setEditUser(u); setEditForm({ name: u.name, email: u.email }); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
          >
            <Pencil className="h-4 w-4 text-slate-400" /> Edit User
          </button>
          
          <button
            onClick={() => { setPwdUser(u); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
          >
            <KeyRound className="h-4 w-4 text-slate-400" /> Reset Password
          </button>

          {u.role === "candidate" && (
            <button
              disabled={busy === u._id}
              onClick={() => { promoteToRecruiter(u._id); setOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
            >
              <ArrowUpRight className="h-4 w-4 text-slate-400" /> Promote to Recruiter
            </button>
          )}

          {u.role !== "admin" && (
             u.moderationFlagged ? (
                <button disabled={busy === u._id} onClick={() => { toggleFlag(u._id, false); setOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 w-full text-left">
                  <FlagOff className="h-4 w-4 text-amber-400" /> Remove Flag
                </button>
             ) : (
                <button disabled={busy === u._id} onClick={() => { toggleFlag(u._id, true); setOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 w-full text-left">
                  <Flag className="h-4 w-4 text-amber-400" /> Flag User
                </button>
             )
          )}

          <div className="my-1 h-px bg-slate-100" />

          {u.isBlocked ? (
             <button disabled={busy === u._id} onClick={() => { unblock(u._id); setOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 w-full text-left">
               Unhide Account
             </button>
          ) : (
             <button disabled={busy === u._id} onClick={() => { block(u._id); setOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 w-full text-left">
               <Ban className="h-4 w-4" /> Suspend
             </button>
          )}

          <button disabled={busy === u._id} onClick={() => { del(u._id); setOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 w-full text-left">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState(() => normalizeRoleParam(searchParams.get("role")));
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [pwdUser, setPwdUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    setRole(normalizeRoleParam(searchParams.get("role")));
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { role: role || undefined, search: search || undefined, page, limit },
      });
      setItems(res.data.users || []);
      setTotal(res.data.total ?? 0);
      setPages(res.data.pages ?? 1);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [role, search, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const block = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/users/${id}/block`);
      toast.success("User suspended");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const unblock = async (id) => {
    setBusy(id);
    try {
      await api.post(`/admin/users/${id}/unblock`);
      toast.success("User reactivated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const promoteToRecruiter = async (id) => {
    setBusy(id);
    try {
      // Mocking role change via edit endpoint if a specific one doesn't exist
      await api.put(`/admin/users/${id}`, { role: "recruiter" });
      toast.success("User promoted to Recruiter");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to promote");
    } finally {
      setBusy(null);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await api.put(`/admin/users/${editUser._id}`, { name: editForm.name, email: editForm.email });
      toast.success("Profile updated");
      setEditUser(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const savePwd = async (e) => {
    e.preventDefault();
    if (!pwdUser || pwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      await api.post(`/admin/users/${pwdUser._id}/reset-password`, { password: pwd });
      toast.success("Password reset");
      setPwdUser(null);
      setPwd("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Permanently delete this user and related data? This cannot be undone.")) return;
    setBusy(id);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  const toggleFlag = async (id, on) => {
    setBusy(id);
    try {
      await api.post(on ? `/admin/users/${id}/flag` : `/admin/users/${id}/unflag`);
      toast.success(on ? "Flagged for review" : "Flag cleared");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const roleSelect = useMemo(
    () => (
      <div className="relative">
        <select
          className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          value={role}
          onChange={(e) => {
            const v = e.target.value;
            setRole(v);
            setPage(1);
            const next = new URLSearchParams(searchParams);
            if (v) next.set("role", v);
            else next.delete("role");
            setSearchParams(next);
          }}
        >
          <option value="">All Roles</option>
          <option value="recruiter">Recruiters</option>
          <option value="candidate">Candidates</option>
          <option value="admin">Admins</option>
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
           <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
        </div>
      </div>
    ),
    [role, searchParams, setSearchParams]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor and manage all platform accounts.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <form onSubmit={onSearchSubmit} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
            Search
          </button>
          {roleSelect}
        </form>
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
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
                    No users matching the filters found.
                  </td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u._id} className="transition hover:bg-slate-50/50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                           {u.name.substring(0, 2)}
                         </div>
                         <p className="font-medium text-slate-900">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${roleBadge(u.role)}`}>
                        {formatRole(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                         <span className={`h-2 w-2 rounded-full ${u.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                         <span className={`text-xs font-medium ${u.isBlocked ? 'text-rose-700' : 'text-slate-700'}`}>
                           {u.isBlocked ? "Suspended" : "Active"}
                         </span>
                         {u.moderationFlagged && (
                           <span className="ml-2 inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                             <Flag className="h-3 w-3" /> Flagged
                           </span>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <UserActionsDropdown 
                         u={u} 
                         busy={busy} 
                         setEditUser={setEditUser} 
                         setEditForm={setEditForm} 
                         setPwdUser={setPwdUser} 
                         block={block} 
                         unblock={unblock} 
                         del={del} 
                         toggleFlag={toggleFlag}
                         promoteToRecruiter={promoteToRecruiter}
                       />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details */}
        {!loading && (
           <div className="flex flex-col items-center justify-between border-t border-slate-100 bg-white px-6 py-4 sm:flex-row">
             <span className="text-sm text-slate-500 mb-4 sm:mb-0">
               Showing page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{pages}</span> <span className="mx-1">·</span> <span className="font-medium text-slate-900">{total}</span> total users
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

      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Edit User Details</h2>
            <form className="mt-6 space-y-4" onSubmit={saveEdit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditUser(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pwdUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
            <p className="mt-1.5 text-sm text-slate-500">Provide a new password for <strong>{pwdUser.name}</strong>.</p>
            <form className="mt-6 space-y-4" onSubmit={savePwd}>
              <div>
                 <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
                 <input
                   type="password"
                   className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                   placeholder="Minimum 8 characters"
                   value={pwd}
                   onChange={(e) => setPwd(e.target.value)}
                   required
                   minLength={8}
                 />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setPwdUser(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700">
                  Force Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
