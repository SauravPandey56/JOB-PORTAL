import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import toast from "react-hot-toast";
import { api, setAuthToken } from "../utils/api.js";

export default function AdminLogin() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post("/admin-auth/login", { username, password });
      // reuse same auth storage shape as AuthContext
      localStorage.setItem("jp_auth_v1", JSON.stringify({ token: res.data.token, user: res.data.user }));
      setAuthToken(res.data.token);
      toast.success("Admin authenticated");
      nav("/admin");
      window.location.reload(); // ensure context picks up localStorage
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold">Admin Panel Login</h2>
        <p className="mt-1 text-sm text-slate-200">
          This page is separate from regular user login.
        </p>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm text-slate-200">Username</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {busy ? "Signing in..." : "Sign in as admin"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

