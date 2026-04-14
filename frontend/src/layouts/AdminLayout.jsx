import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  Inbox,
  FileBarChart,
  LineChart,
  Settings,
  Shield,
  Menu,
  X,
  UserCog,
  Building2,
  Bell,
  History,
  Search,
  Plus,
} from "lucide-react";
import { useAuth } from "../state/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/recruiters", label: "Recruiters", icon: UserCog },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: ClipboardList },
  { to: "/admin/moderation", label: "Moderation", icon: Shield },
  { to: "/admin/feedback", label: "Feedback", icon: Inbox },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: History },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function linkClass({ isActive }) {
  return [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-slate-900 dark:bg-slate-800 text-white shadow-md shadow-slate-900/15"
      : "text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--text-main)]",
  ].join(" ");
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      <button
        type="button"
        className={[
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed bottom-0 left-0 top-0 z-50 flex w-[min(17rem,88vw)] flex-col border-r border-[var(--border-subtle)] bg-[var(--card-bg)] shadow-xl transition-transform duration-300 lg:sticky lg:z-0 lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-none">Console</p>
              <p className="text-sm font-semibold text-[var(--text-main)] leading-tight">TalentOrbit</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 custom-scrollbar" aria-label="Admin navigation">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Main Menu</div>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--app-bg-gradient)] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex rounded-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)] hover:bg-[var(--card-bg)] lg:hidden"
              aria-label="Open admin menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Global Search */}
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 transition-colors focus-within:border-[var(--primary-override)]">
               <Search className="h-4 w-4 text-[var(--text-muted)]" />
               <input 
                 type="text" 
                 placeholder="Search users, jobs, companies..." 
                 className="w-72 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] text-[var(--text-main)]" 
               />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
             <button className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700">
               <Plus className="h-4 w-4" /> Create New
             </button>
             
             <div className="h-6 w-px bg-[var(--border-subtle)] hidden sm:block"></div>
             
             <button className="relative rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--card-bg)] hover:text-[var(--text-main)]">
               <Bell className="h-5 w-5" />
               <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[var(--app-bg-gradient)] bg-rose-500" />
             </button>
             
             {/* Admin Profile Dropdown */}
             <div className="group relative ml-1 flex cursor-pointer items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full flex items-center justify-center bg-[var(--card-bg)] shadow-sm">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} alt="Admin Avatar" className="h-full w-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[var(--text-main)]">{user?.name || "Super Admin"}</p>
                </div>
                {/* Dropdown Menu on hover */}
                <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-1 shadow-lg group-hover:block z-50">
                   <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                     <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
                     <p className="text-sm font-medium text-[var(--text-main)] truncate">{user?.email || "admin@talentorbit.com"}</p>
                   </div>
                   <NavLink to="/" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800">
                     Exit to Site
                   </NavLink>
                   <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                     Logout
                   </button>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
