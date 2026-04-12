import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-h3 font-semibold text-dark">TalentOrbit</div>
            <p className="mt-2 max-w-sm text-body text-slate-600">
              A modern job platform for candidates, recruiters, and teams who care about hiring quality.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <div className="text-small font-semibold uppercase tracking-wide text-slate-500">Product</div>
              <ul className="mt-3 space-y-2 text-body text-slate-700">
                <li>
                  <Link className="transition hover:text-primary" to="/jobs">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-primary" to="/register">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-primary" to="/login">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-small font-semibold uppercase tracking-wide text-slate-500">Legal</div>
              <ul className="mt-3 space-y-2 text-body text-slate-700">
                <li>
                  <span className="text-slate-500">Privacy (demo)</span>
                </li>
                <li>
                  <span className="text-slate-500">Terms (demo)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-small text-slate-500">
          © {new Date().getFullYear()} TalentOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
