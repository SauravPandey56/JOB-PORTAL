import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [role, setRole] = useState("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [qualification, setQualification] = useState("");
  const [preferredCategory, setPreferredCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const showCandidate = role === "candidate";
  const showRecruiter = role === "recruiter";

  const payload = useMemo(() => {
    const base = { role, name, email, password };
    if (showCandidate) return { ...base, skills, qualification, preferredCategory };
    if (showRecruiter) return { ...base, companyName, companyDescription };
    return base;
  }, [
    role,
    name,
    email,
    password,
    showCandidate,
    showRecruiter,
    skills,
    qualification,
    preferredCategory,
    companyName,
    companyDescription,
  ]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(payload);
      nav("/dashboard");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold">Create account</h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-200">Role</label>
            <select
              className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="candidate">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-200">Name</label>
              <input
                className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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

          {showCandidate && (
            <>
              <div>
                <label className="text-sm text-slate-200">Skills (comma separated)</label>
                <input
                  className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-200">Qualification</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-200">Preferred category</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                    value={preferredCategory}
                    onChange={(e) => setPreferredCategory(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {showRecruiter && (
            <>
              <div>
                <label className="text-sm text-slate-200">Company name</label>
                <input
                  className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-200">Company description</label>
                <textarea
                  className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-sky-500 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50"
          >
            {busy ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-300">
          Note: Admin is for local development only (no public admin route).
        </p>
      </GlassCard>
    </div>
  );
}

