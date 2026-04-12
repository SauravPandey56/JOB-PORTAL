import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  User,
  Bell,
  Settings,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidate/applications", label: "My Applications", icon: ClipboardList },
  { to: "/candidate/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { to: "/candidate", label: "Profile & resume", icon: User, end: true },
  { to: "/candidate/notifications", label: "Notifications", icon: Bell },
];

function linkCls({ isActive }) {
  return [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-dark",
  ].join(" ");
}

export default function CandidateLayout() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row md:py-10">
      <aside className="w-full shrink-0 md:w-56 lg:w-64">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-card">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
          <nav className="flex flex-col gap-0.5" aria-label="Candidate">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={`${to}-${label}`} to={to} end={Boolean(end)} className={linkCls}>
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {label}
              </NavLink>
            ))}
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-dark"
            >
              <Settings className="h-4 w-4 shrink-0" strokeWidth={2} />
              Settings
            </Link>
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
