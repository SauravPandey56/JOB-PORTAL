import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import AnimatedLogo from "./AnimatedLogo.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();
  const { isAuthed } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-[var(--text-muted)]"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 text-sm font-medium transition-colors rounded-xl ${
      isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600"
    }`;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled 
          ? "bg-[var(--card-bg)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border-subtle)] py-3" 
          : "bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-transparent py-4"
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:z-50">
        Skip to main content
      </a>
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
             <AnimatedLogo />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">TalentOrbit</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Primary">
          <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
          <a href="/#companies" className="text-sm font-medium text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Companies</a>
          <Link to="/register?intent=recruiter" className="text-sm font-medium text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">For Recruiters</Link>
          <a href="/#resources" className="text-sm font-medium text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Career Advice</a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!isAuthed ? (
            <div className="hidden md:flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm font-medium text-[var(--text-main)] hover:text-indigo-600 px-4 py-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md px-5 py-2.5 rounded-xl transition-all"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Go to Dashboard</Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              <ProfileMenu />
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthed && <ProfileMenu />}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute w-full bg-[var(--card-bg)] border-b border-[var(--border-subtle)] shadow-xl transition-all duration-300 overflow-hidden origin-top ${
          mobileOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      >
        <div className="px-4 py-6 space-y-2 max-w-7xl mx-auto max-h-[80vh] overflow-y-auto">
          <NavLink to="/jobs" className={mobileNavLinkClass}>Jobs</NavLink>
          <a href="/#companies" className="block px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">Companies</a>
          <Link to="/register?intent=recruiter" className="block px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">For Recruiters</Link>
          <a href="/#resources" className="block px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">Career Advice</a>
          
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
          
          {!isAuthed ? (
            <div className="grid grid-cols-2 gap-3 pb-2">
              <Link to="/login" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-[var(--text-main)] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                Log In
              </Link>
              <Link to="/register" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                Create Account
              </Link>
            </div>
          ) : (
             <div className="pb-2">
                <Link to="/dashboard" className="flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                   Go to Dashboard
                </Link>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}
