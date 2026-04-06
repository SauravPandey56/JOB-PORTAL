import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

function pill(text) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-200">
      {text}
    </span>
  );
}

export default function Jobs() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  const q = sp.get("q") || "";
  const skills = sp.get("skills") || "";
  const category = sp.get("category") || "";
  const location = sp.get("location") || "";
  const page = Number(sp.get("page") || "1");

  const query = useMemo(
    () => ({ q, skills, category, location, page }),
    [q, skills, category, location, page]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/jobs", { params: { ...query, limit: 12 } })
      .then((res) => {
        if (!alive) return;
        setData(res.data);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [query]);

  const updateParam = (k, v) => {
    const next = new URLSearchParams(sp);
    if (!v) next.delete(k);
    else next.set(k, v);
    next.set("page", "1");
    setSp(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Jobs</h2>
          <p className="text-sm text-slate-200">Search and filter roles in real-time.</p>
        </div>
        <div className="grid w-full gap-2 md:w-auto md:grid-cols-4">
          <input
            className="rounded-xl bg-slate-900/60 border-white/10"
            placeholder="Search (title, desc, location)"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
          />
          <input
            className="rounded-xl bg-slate-900/60 border-white/10"
            placeholder="Skills: react,node"
            value={skills}
            onChange={(e) => updateParam("skills", e.target.value)}
          />
          <input
            className="rounded-xl bg-slate-900/60 border-white/10"
            placeholder="Category"
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
          />
          <input
            className="rounded-xl bg-slate-900/60 border-white/10"
            placeholder="Location"
            value={location}
            onChange={(e) => updateParam("location", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading ? (
          <GlassCard className="p-6 md:col-span-2">Loading...</GlassCard>
        ) : data.items.length === 0 ? (
          <GlassCard className="p-6 md:col-span-2">No jobs found.</GlassCard>
        ) : (
          data.items.map((job) => (
            <GlassCard key={job._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="mt-1 text-xs text-slate-300">
                    {job.recruiterId?.company?.name || job.recruiterId?.name || "Recruiter"} ·{" "}
                    {job.location || "Remote"}
                  </p>
                </div>
                <Link
                  to={`/jobs/${job._id}`}
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
                >
                  View
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.category ? pill(job.category) : null}
                {job.experienceLevel ? pill(job.experienceLevel) : null}
                {job.salaryMax ? pill(`₹${job.salaryMin || 0} - ₹${job.salaryMax}`) : null}
              </div>

              {job.requiredSkills?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 6).map((s) => pill(s))}
                </div>
              ) : null}
            </GlassCard>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-200">
        <span>
          Page {data.page} / {data.pages} · {data.total} jobs
        </span>
        <div className="flex gap-2">
          <button
            disabled={data.page <= 1}
            onClick={() => setSp((prev) => {
              const next = new URLSearchParams(prev);
              next.set("page", String(Math.max(1, data.page - 1)));
              return next;
            })}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={data.page >= data.pages}
            onClick={() => setSp((prev) => {
              const next = new URLSearchParams(prev);
              next.set("page", String(Math.min(data.pages, data.page + 1)));
              return next;
            })}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

