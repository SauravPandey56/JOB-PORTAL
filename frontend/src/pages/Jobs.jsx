import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

function pill(text) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {text}
    </span>
  );
}

function JobCardSkeleton() {
  return (
    <GlassCard className="animate-pulse p-5">
      <div className="h-5 w-[60%] rounded-lg bg-slate-100" />
      <div className="mt-3 h-3 w-[40%] rounded bg-slate-100" />
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-20 rounded-full bg-slate-100" />
      </div>
    </GlassCard>
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-h2 text-dark">Browse jobs</h1>
          <p className="mt-2 max-w-xl text-body text-slate-600">
            Refine by keywords, skills, category, or location. Results update as you type.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="jobs-filter-q" className="mb-1 block text-small font-medium uppercase tracking-wide text-slate-500">
            Search
          </label>
          <input
            id="jobs-filter-q"
            className="input-field"
            placeholder="Title, description, location"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="jobs-filter-skills" className="mb-1 block text-small font-medium uppercase tracking-wide text-slate-500">
            Skills
          </label>
          <input
            id="jobs-filter-skills"
            className="input-field"
            placeholder="e.g. react, node"
            value={skills}
            onChange={(e) => updateParam("skills", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="jobs-filter-category" className="mb-1 block text-small font-medium uppercase tracking-wide text-slate-500">
            Category
          </label>
          <input
            id="jobs-filter-category"
            className="input-field"
            placeholder="Engineering, Sales…"
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="jobs-filter-location" className="mb-1 block text-small font-medium uppercase tracking-wide text-slate-500">
            Location
          </label>
          <input
            id="jobs-filter-location"
            className="input-field"
            placeholder="City or remote"
            value={location}
            onChange={(e) => updateParam("location", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {loading ? (
          <>
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </>
        ) : data.items.length === 0 ? (
          <GlassCard className="p-8 text-center md:col-span-2">
            <p className="text-body font-semibold text-dark">No jobs match your filters</p>
            <p className="mt-2 text-small text-slate-600">Try clearing a field or using broader keywords.</p>
            <button
              type="button"
              onClick={() => setSp(new URLSearchParams())}
              className="btn-secondary mt-6 w-full max-w-xs"
            >
              Clear all filters
            </button>
          </GlassCard>
        ) : (
          data.items.map((job) => (
            <GlassCard key={job._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-h3 text-dark">{job.title}</h2>
                  <p className="mt-1 text-small text-slate-600">
                    {job.recruiterId?.company?.name || job.recruiterId?.name || "Recruiter"} ·{" "}
                    {job.location || "Remote"}
                  </p>
                </div>
                <Link
                  to={`/jobs/${job._id}`}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-small font-semibold text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/5"
                >
                  View role
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.category ? pill(job.category) : null}
                {job.experienceLevel ? pill(job.experienceLevel) : null}
                {job.salaryMax ? pill(`₹${job.salaryMin || 0} – ₹${job.salaryMax}`) : null}
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

      <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 text-body text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page <span className="font-semibold text-dark">{data.page}</span> of{" "}
          <span className="font-semibold text-dark">{data.pages}</span>
          <span className="mx-2 text-slate-400">·</span>
          <span className="font-semibold text-dark">{data.total}</span> jobs
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() =>
              setSp((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", String(Math.max(1, data.page - 1)));
                return next;
              })
            }
            className="btn-secondary min-h-[2.75rem] px-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={data.page >= data.pages}
            onClick={() =>
              setSp((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", String(Math.min(data.pages, data.page + 1)));
                return next;
              })
            }
            className="btn-secondary min-h-[2.75rem] px-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
