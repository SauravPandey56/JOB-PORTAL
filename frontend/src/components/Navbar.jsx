import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import logo from "../assets/talentorbit-logo.svg";

function getNavLinkClass(isHome) {
  return ({ isActive }) =>
    [
      "px-3 py-2 rounded-xl text-sm transition",
      isHome
        ? isActive
          ? "bg-slate-900/5 text-slate-900"
          : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900"
        : isActive
          ? "bg-white/10 text-white"
          : "text-slate-200 hover:bg-white/5 hover:text-white",
    ].join(" ");
}

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  const navLinkClass = getNavLinkClass(isHome);

  return (
    <header
      className={[
        "sticky top-0 z-40 backdrop-blur-xl",
        isHome ? "border-b border-slate-200/70 bg-white/70" : "border-b border-white/10 bg-slate-950/60",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className={[
            "flex items-center gap-2 font-semibold tracking-tight",
            isHome ? "text-slate-900" : "text-white",
          ].join(" ")}
        >
          <img src={logo} alt="TalentOrbit" className="h-7 w-7" />
          <span>TalentOrbit</span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          {!isAuthed ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <button
                onClick={logout}
                className={[
                  "px-3 py-2 rounded-xl text-sm",
                  isHome ? "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900" : "text-slate-200 hover:bg-white/5",
                ].join(" ")}
              >
                Logout
              </button>
              <span className={["hidden sm:inline text-xs", isHome ? "text-slate-500" : "text-slate-300"].join(" ")}>
                {user?.name} · {user?.role}
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

