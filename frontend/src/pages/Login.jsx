import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ email, password });
      nav(loc.state?.from || "/dashboard");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold">Login</h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Password</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <button
            disabled={busy}
            className="w-full rounded-xl bg-sky-500 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-200">
          No account?{" "}
          <Link to="/register" className="text-sky-400 hover:text-sky-300">
            Register
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

