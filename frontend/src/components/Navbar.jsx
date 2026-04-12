import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import AnimatedLogo from "./AnimatedLogo.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

const linkBase =
  "rounded-xl px-3 py-2.5 text-small font-medium transition min-h-[2.75rem] inline-flex items-center justify-center";

function navClass() {
  return ({ isActive }) =>
    [
      linkBase,
      isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-dark",
    ].join(" ");
}

function navClassBlock() {
  return ({ isActive }) =>
    [
      "flex w-full items-center justify-center text-center sm:justify-start sm:text-left",
      linkBase,
      isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-dark",
    ].join(" ");
}

export default function Navbar() {
  const loc = useLocation();
  const { isAuthed } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinkClass = navClass();
  const navLinkClassBlock = navClassBlock();

  useEffect(() => {
    setMobileOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-h-[2.75rem] items-center gap-2.5 font-semibold tracking-tight text-dark">
          <AnimatedLogo />
          <span className="text-h3">TalentOrbit</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>
            <a href="/#companies" className={linkBase + " text-slate-600 hover:bg-slate-100 hover:text-dark"}>
              Companies
            </a>
            <Link
              to="/register?intent=recruiter"
              className={linkBase + " text-slate-600 hover:bg-slate-100 hover:text-dark"}
            >
              For recruiters
            </Link>

            {!isAuthed ? (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    [
                      linkBase,
                      "ml-1 bg-primary text-white shadow-md hover:bg-blue-700",
                      isActive ? "ring-2 ring-primary/40" : "",
                    ].join(" ")
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {isAuthed ? <ProfileMenu /> : null}

          <button
            type="button"
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-dark hover:bg-slate-50 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="site-mobile-nav"
        className={["border-t border-slate-200 bg-white md:hidden", mobileOpen ? "block" : "hidden"].join(" ")}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Primary mobile">
          <NavLink to="/jobs" className={navLinkClassBlock}>
            Jobs
          </NavLink>
          <a href="/#companies" className={navLinkClassBlock({ isActive: false })}>
            Companies
          </a>
          <Link to="/register?intent=recruiter" className={navLinkClassBlock({ isActive: false })}>
            For recruiters
          </Link>
          {!isAuthed ? (
            <>
              <NavLink to="/login" className={navLinkClassBlock}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClassBlock}>
                Register
              </NavLink>
            </>
          ) : (
            <NavLink to="/dashboard" className={navLinkClassBlock}>
              Dashboard
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
