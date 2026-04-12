import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import JobCard from "../components/jobs/JobCard.jsx";
import FilterPanel from "../components/jobs/FilterPanel.jsx";
import JobListSkeleton from "../components/jobs/JobListSkeleton.jsx";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Jobs() {
  const { isAuthed, user } = useAuth();
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [savedSet, setSavedSet] = useState(() => new Set());

  const q = sp.get("q") || "";
  const skills = sp.get("skills") || "";
  const category = sp.get("category") || "";
  const location = sp.get("location") || "";
  const experience = sp.get("experience") || "";
  const minSalary = sp.get("minSalary") || "";
  const maxSalary = sp.get("maxSalary") || "";
  const workMode = sp.get("workMode") || "";
  const page = Number(sp.get("page") || "1");

  const query = useMemo(
    () => ({
      q,
      skills,
      category,
      location,
      experience,
      minSalary: minSalary || undefined,
      maxSalary: maxSalary || undefined,
      workMode: workMode || undefined,
      page,
    }),
    [q, skills, category, location, experience, minSalary, maxSalary, workMode, page]
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

  const loadSaved = useCallback(async () => {
    if (!isAuthed || user?.role !== "candidate") return;
    try {
      const res = await api.get("/users/me/saved-jobs");
      const ids = new Set((res.data.jobs || []).map((j) => String(j._id)));
      setSavedSet(ids);
    } catch {
      /* ignore */
    }
  }, [isAuthed, user?.role]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const updateParam = (k, v) => {
    const next = new URLSearchParams(sp);
    if (!v) next.delete(k);
    else next.set(k, v);
    next.set("page", "1");
    setSp(next);
  };

  const toggleSave = async (jobId, currentlySaved) => {
    if (!isAuthed || user?.role !== "candidate") {
      toast.error("Sign in as a candidate to save jobs");
      return;
    }
    try {
      if (currentlySaved) {
        await api.delete(`/users/me/saved-jobs/${jobId}`);
        setSavedSet((prev) => {
          const n = new Set(prev);
          n.delete(String(jobId));
          return n;
        });
        toast.success("Removed from saved");
      } else {
        await api.post(`/users/me/saved-jobs/${jobId}`);
        setSavedSet((prev) => new Set(prev).add(String(jobId)));
        toast.success("Saved");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not update");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-h2 text-dark">Browse jobs</h1>
        <p className="mt-2 max-w-2xl text-body text-slate-600">
          Filter by location, experience, salary, and work mode — curated roles from verified recruiters.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FilterPanel
            q={q}
            location={location}
            skills={skills}
            category={category}
            experience={experience}
            minSalary={minSalary}
            maxSalary={maxSalary}
            workMode={workMode}
            onChange={updateParam}
          />
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <JobListSkeleton count={6} />
            </div>
          ) : data.items.length === 0 ? (
            <GlassCard className="p-10 text-center">
              <p className="text-body font-semibold text-dark">No jobs match your filters</p>
              <p className="mt-2 text-small text-slate-600">Try clearing filters or broadening keywords.</p>
              <button type="button" onClick={() => setSp(new URLSearchParams())} className="btn-secondary mx-auto mt-6 max-w-xs">
                Clear all filters
              </button>
            </GlassCard>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {data.items.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  showSave={isAuthed && user?.role === "candidate"}
                  saved={savedSet.has(String(job._id))}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}

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
      </div>
    </div>
  );
}
