import { useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import {
  EMAIL_INVALID_MESSAGE,
  isStrongPassword,
  isValidEmail,
  PASSWORD_POLICY_MESSAGE,
} from "../utils/validation.js";

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (d?.message) return d.message;
  if (Array.isArray(d?.errors) && d.errors[0]?.msg) return d.errors[0].msg;
  return "Something went wrong. Please try again.";
}

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const roleId = useId();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const skillsId = useId();
  const qualificationId = useId();
  const preferredId = useId();
  const companyId = useId();
  const companyDescId = useId();

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
  const [error, setError] = useState("");

  const showCandidate = role === "candidate";
  const showRecruiter = role === "recruiter";

  const payload = useMemo(() => {
    const base = { role, name, email: email.trim(), password };
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
    setError("");
    if (!isValidEmail(email)) {
      setError(EMAIL_INVALID_MESSAGE);
      return;
    }
    if (!isStrongPassword(password)) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }
    setBusy(true);
    try {
      await register(payload);
      nav("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <GlassCard className="p-6 sm:p-8">
        <h1 className="text-h2 text-dark">Create your account</h1>
        <p className="mt-2 text-body text-slate-600">Choose how you will use TalentOrbit, then complete your profile.</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-small text-red-800" role="alert">
              {error}
            </div>
          ) : null}
          <div>
            <label htmlFor={roleId} className="text-small font-medium text-slate-700">
              I am a
            </label>
            <select
              id={roleId}
              className="input-field mt-1.5"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="candidate">Job seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={nameId} className="text-small font-medium text-slate-700">
                Full name
              </label>
              <input
                id={nameId}
                className="input-field mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Doe"
                required
              />
            </div>
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
              autoComplete="new-password"
              placeholder="8+ chars, upper, lower, symbol"
              required
            />
            <p className="mt-1.5 text-small text-slate-500">{PASSWORD_POLICY_MESSAGE}</p>
          </div>

          {showCandidate && (
            <>
              <div>
                <label htmlFor={skillsId} className="text-small font-medium text-slate-700">
                  Skills <span className="font-normal text-slate-500">(comma-separated)</span>
                </label>
                <input
                  id={skillsId}
                  className="input-field mt-1.5"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, SQL"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={qualificationId} className="text-small font-medium text-slate-700">
                    Qualification
                  </label>
                  <input
                    id={qualificationId}
                    className="input-field mt-1.5"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="B.Tech, MBA…"
                  />
                </div>
                <div>
                  <label htmlFor={preferredId} className="text-small font-medium text-slate-700">
                    Preferred category
                  </label>
                  <input
                    id={preferredId}
                    className="input-field mt-1.5"
                    value={preferredCategory}
                    onChange={(e) => setPreferredCategory(e.target.value)}
                    placeholder="Engineering, Design…"
                  />
                </div>
              </div>
            </>
          )}

          {showRecruiter && (
            <>
              <div>
                <label htmlFor={companyId} className="text-small font-medium text-slate-700">
                  Company name
                </label>
                <input
                  id={companyId}
                  className="input-field mt-1.5"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  required
                />
              </div>
              <div>
                <label htmlFor={companyDescId} className="text-small font-medium text-slate-700">
                  Company description
                </label>
                <textarea
                  id={companyDescId}
                  className="input-field mt-1.5 min-h-[5.5rem] resize-y py-3"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="What does your company do?"
                  rows={3}
                />
              </div>
            </>
          )}

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-8 text-center text-body text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
