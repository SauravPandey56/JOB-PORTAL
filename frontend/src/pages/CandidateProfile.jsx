import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import toast from "react-hot-toast";

export default function CandidateProfile() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [skills, setSkills] = useState((user?.skills || []).join(", "));
  const [qualification, setQualification] = useState(user?.qualification || "");
  const [preferredCategory, setPreferredCategory] = useState(user?.preferredCategory || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setSkills((user?.skills || []).join(", "));
    setQualification(user?.qualification || "");
    setPreferredCategory(user?.preferredCategory || "");
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put("/users/me", { name, skills, qualification, preferredCategory });
      await refreshMe();
      toast.success("Profile updated");
    } finally {
      setBusy(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return toast.error("Choose a PDF first");
    const fd = new FormData();
    fd.append("resume", resumeFile);
    setBusy(true);
    try {
      await api.post("/users/me/resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await refreshMe();
      toast.success("Resume uploaded");
      setResumeFile(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">My profile</h2>
      <GlassCard className="p-6">
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm text-slate-200">Name</label>
            <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-200">Skills (comma separated)</label>
            <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-200">Qualification</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={qualification} onChange={(e) => setQualification(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-200">Preferred category</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={preferredCategory} onChange={(e) => setPreferredCategory(e.target.value)} />
            </div>
          </div>
          <button disabled={busy} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50">
            Save profile
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-medium">Resume</h3>
        <p className="mt-1 text-sm text-slate-200">
          Current:{" "}
          {user?.resume?.url ? (
            <a className="text-sky-400 hover:text-sky-300" href={`http://localhost:5000${user.resume.url}`} target="_blank" rel="noreferrer">
              {user.resume.originalName || "View"}
            </a>
          ) : (
            "Not uploaded"
          )}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-slate-100 hover:file:bg-white/15"
          />
          <button
            disabled={busy}
            onClick={uploadResume}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

