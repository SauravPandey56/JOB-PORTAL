import { Link } from "react-router-dom";
import { Bookmark, MapPin, IndianRupee, Briefcase } from "lucide-react";
import GlassCard from "../GlassCard.jsx";

function workModeLabel(mode) {
  if (mode === "remote") return "Remote";
  if (mode === "hybrid") return "Hybrid";
  return "On-site";
}

export default function JobCard({ job, saved, onToggleSave, showSave }) {
  const company = job.recruiterId?.company?.name || job.recruiterId?.name || "Company";
  const initial = (company || "C").slice(0, 1).toUpperCase();

  return (
    <GlassCard className="group flex h-full flex-col p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-indigo-100 text-lg font-bold text-primary ring-1 ring-primary/10">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-dark transition hover:text-primary">
                {job.title}
              </Link>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-600">{company}</p>
            </div>
            {showSave ? (
              <button
                type="button"
                aria-label={saved ? "Remove from saved" : "Save job"}
                onClick={() => onToggleSave?.(job._id, saved)}
                className={[
                  "shrink-0 rounded-xl border p-2 transition",
                  saved
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary",
                ].join(" ")}
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} strokeWidth={2} />
              </button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {job.location || "Location TBD"}
            </span>
            {job.salaryMax ? (
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                {job.salaryMin || 0} – {job.salaryMax} LPA
              </span>
            ) : null}
            {job.experienceLevel ? (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {job.experienceLevel} yrs
              </span>
            ) : null}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 ring-1 ring-slate-200/80">
              {workModeLabel(job.workMode)}
            </span>
          </div>

          {job.requiredSkills?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.requiredSkills.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex min-h-[2.5rem] flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:flex-none"
        >
          View & apply
        </Link>
      </div>
    </GlassCard>
  );
}
