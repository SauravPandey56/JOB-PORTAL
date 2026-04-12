import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Eye, Ban, Trash2, Pencil, KeyRound, RefreshCw, Flag, FlagOff } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

function normalizeRoleParam(raw) {
  const r = (raw || "").toString().trim();
  return ["recruiter", "candidate", "admin"].includes(r) ? r : "";
}

function roleBadge(role) {
  if (role === "admin") return "bg-violet-100 text-violet-800 ring-violet-600/10";
  if (role === "recruiter") return "bg-sky-100 text-sky-800 ring-sky-600/10";
  return "bg-emerald-100 text-emerald-800 ring-emerald-600/10";
}

function formatRole(role) {
  if (role === "admin") return "Admin";
  if (role === "recruiter") return "Recruiter";
  if (role === "candidate") return "Candidate";
  return role || "—";
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
    if (!window.confirm("Permanently delete this user and related data?")) return;
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
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm"
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
        <option value="">All roles</option>
        <option value="recruiter">Recruiter</option>
        <option value="candidate">Candidate</option>
        <option value="admin">Admin</option>
      </select>
    ),
    [role, searchParams, setSearchParams]
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-600">Search, filter, and moderate accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <GlassCard className="p-4">
        <form onSubmit={onSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {roleSelect}
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
            Search
          </button>
        </form>
      </GlassCard>

      {loading ? (
        <GlassCard className="p-8 text-center text-slate-600">Loading…</GlassCard>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  items.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80">
                      <td className="max-w-[140px] truncate px-4 py-3 font-medium text-slate-900">{u.name}</td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${roleBadge(u.role)}`}>
                          {formatRole(u.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {u.isBlocked ? (
                            <span className="text-xs font-medium text-rose-700">Suspended</span>
                          ) : (
                            <span className="text-xs font-medium text-emerald-700">Active</span>
                          )}
                          {u.moderationFlagged ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                              Flagged
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            to={u.role === "candidate" ? "/candidate" : "/dashboard"}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            title="View profile (public routes)"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setEditUser(u);
                              setEditForm({ name: u.name, email: u.email });
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPwdUser(u);
                              setPwd("");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            Reset pwd
                          </button>
                          {u.isBlocked ? (
                            <button
                              type="button"
                              disabled={busy === u._id}
                              onClick={() => unblock(u._id)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-50"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy === u._id}
                              onClick={() => block(u._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Suspend
                            </button>
                          )}
                          {u.role !== "admin" ? (
                            u.moderationFlagged ? (
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => toggleFlag(u._id, false)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
                              >
                                <FlagOff className="h-3.5 w-3.5" />
                                Unflag
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy === u._id}
                                onClick={() => toggleFlag(u._id, true)}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/50 px-2 py-1 text-xs text-amber-900 hover:bg-amber-50 disabled:opacity-50"
                              >
                                <Flag className="h-3.5 w-3.5" />
                                Flag
                              </button>
                            )
                          ) : null}
                          <button
                            type="button"
                            disabled={busy === u._id}
                            onClick={() => del(u._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"
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
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 sm:flex-row">
            <span>
              Page {page} of {pages} · {total} users
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {editUser ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4" role="dialog">
          <GlassCard className="w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Edit user</h2>
            <form className="mt-4 space-y-3" onSubmit={saveEdit}>
              <div>
                <label className="text-xs font-medium text-slate-600">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditUser(null)} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                  Save
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : null}

      {pwdUser ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4" role="dialog">
          <GlassCard className="w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">Reset password</h2>
            <p className="mt-1 text-sm text-slate-600">Set a new password for {pwdUser.name}</p>
            <form className="mt-4 space-y-3" onSubmit={savePwd}>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Min 8 characters"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                minLength={8}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPwdUser(null)} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                  Reset
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
