import { useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import {
  EMAIL_INVALID_MESSAGE,
  isValidEmail,
} from "../utils/validation.js";

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (d?.message) return d.message;
  if (Array.isArray(d?.errors) && d.errors[0]?.msg) return d.errors[0].msg;
  return "Something went wrong. Please try again.";
}

export default function Login() {
  const emailId = useId();
  const passwordId = useId();
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError(EMAIL_INVALID_MESSAGE);
      return;
    }
    setBusy(true);
    try {
      await login({ email: email.trim(), password });
      nav(loc.state?.from || "/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <GlassCard className="p-6 sm:p-8">
        <h1 className="text-h2 text-dark">Welcome back</h1>
        <p className="mt-2 text-body text-slate-600">Sign in with your work email.</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-small text-red-800" role="alert">
              {error}
            </div>
          ) : null}
          <div>
            <label htmlFor={emailId} className="text-small font-medium text-slate-700">
              Email
            </label>
            <input
              id={emailId}
              className="input-field mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor={passwordId} className="text-small font-medium text-slate-700">
              Password
            </label>
            <input
              id={passwordId}
              className="input-field mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-8 text-center text-body text-slate-600">
          No account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:text-accent hover:underline">
            Create one
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
