import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export default function RecruiterJobForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/jobs/${id}`).then((res) => {
      const j = res.data.job;
      setTitle(j.title || "");
      setDescription(j.description || "");
      setRequiredSkills((j.requiredSkills || []).join(", "));
      setSalaryMin(j.salaryMin ?? "");
      setSalaryMax(j.salaryMax ?? "");
      setExperienceLevel(j.experienceLevel || "");
      setCategory(j.category || "");
      setLocation(j.location || "");
      setIsActive(!!j.isActive);
    });
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        title,
        description,
        requiredSkills,
        salaryMin,
        salaryMax,
        experienceLevel,
        category,
        location,
        isActive,
      };
      if (isEdit) await api.put(`/jobs/${id}`, payload);
      else await api.post("/jobs", payload);
      toast.success(isEdit ? "Updated" : "Created");
      nav("/recruiter/jobs");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">{isEdit ? "Edit job" : "New job"}</h2>
      <GlassCard className="p-6">
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm text-slate-200">Title</label>
            <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-200">Description</label>
            <textarea className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-200">Required skills (comma separated)</label>
            <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-200">Salary min</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-200">Salary max</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-200">Experience</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="0-1 / 2-4 / 5+" />
            </div>
            <div>
              <label className="text-sm text-slate-200">Category</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-200">Location</label>
              <input className="mt-1 w-full rounded-xl bg-slate-900/60 border-white/10" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-white/10 bg-slate-900/60" />
              <label htmlFor="active" className="text-sm text-slate-200">
                Active
              </label>
            </div>
          </div>
          <button disabled={busy} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-50">
            {busy ? "Saving..." : "Save"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

