import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

function initialsFromName(name) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function roleLabel(role) {
  if (role === "candidate") return "Candidate";
  if (role === "recruiter") return "Recruiter";
  if (role === "admin") return "Admin";
  return role ? String(role) : "User";
}

function profilePath(role) {
  return "/profile";
}

function settingsPath(role) {
  if (role === "candidate") return "/candidate";
  return "/dashboard";
}

const itemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-dark";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const avatarSrc = user.avatarUrl || user.image || user.photoUrl;
  const label = roleLabel(user.role);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white shadow-sm ring-0 transition duration-200 ease-out hover:scale-[1.06] hover:border-slate-300 hover:shadow-md active:scale-[0.98] md:h-9 md:w-9"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt=""
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xs font-semibold tracking-tight text-primary" aria-hidden>
            {initialsFromName(user.name)}
          </span>
        )}
      </button>

      <div
        role="menu"
        className={[
          "origin-top-right transform-gpu rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-md transition-[opacity,transform,visibility] duration-200 ease-out",
          "max-md:fixed max-md:left-4 max-md:right-4 max-md:top-[4.25rem] max-md:z-[60]",
          "md:absolute md:right-0 md:top-full md:mt-2 md:min-w-[15.5rem] md:w-max md:max-w-[min(18rem,calc(100vw-2rem))]",
          open
            ? "visible pointer-events-auto translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-1 opacity-0",
        ].join(" ")}
      >
        <div className="border-b border-slate-100 px-3 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-primary shadow-inner">
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                initialsFromName(user.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-dark">{user.name}</p>
              <p className="mt-0.5 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {label}
              </p>
            </div>
          </div>
        </div>

        <div className="py-1">
          <NavLink to={profilePath(user.role)} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            Profile
          </NavLink>
          <NavLink to="/dashboard" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          {user.role === "candidate" ? (
            <NavLink
              to="/candidate/applications"
              role="menuitem"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              My Applications
            </NavLink>
          ) : null}
          {user.role === "candidate" ? (
            <NavLink
              to="/candidate/saved-jobs"
              role="menuitem"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              Saved jobs
            </NavLink>
          ) : null}
          {user.role === "candidate" ? (
            <NavLink
              to="/candidate/notifications"
              role="menuitem"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              Notifications
            </NavLink>
          ) : null}
          {user.role === "recruiter" || user.role === "admin" ? (
            <NavLink to="/recruiter/jobs" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              My Jobs
            </NavLink>
          ) : null}
          {user.role === "admin" ? (
            <NavLink to="/admin" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              Admin Panel
            </NavLink>
          ) : null}
          <NavLink to={settingsPath(user.role)} role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            Settings
          </NavLink>
        </div>

        <div className="border-t border-slate-100 pt-1">
          <button type="button" role="menuitem" className={itemClass} onClick={() => { setOpen(false); logout(); }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
