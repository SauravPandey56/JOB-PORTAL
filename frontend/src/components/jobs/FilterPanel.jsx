/** Left-column job filters — controlled via URL search params from parent. */
export default function FilterPanel({
  q,
  location,
  skills,
  category,
  experience,
  minSalary,
  maxSalary,
  workMode,
  onChange,
}) {
  const row = "space-y-1.5";
  const label = "text-xs font-semibold uppercase tracking-wide text-slate-500";
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-dark shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card">
      <div>
        <h2 className="text-sm font-bold text-dark">Filters</h2>
        <p className="mt-0.5 text-xs text-slate-500">Refine listings</p>
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-q">
          Keywords
        </label>
        <input id="flt-q" className={input} placeholder="Title, stack, company" value={q} onChange={(e) => onChange("q", e.target.value)} />
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-loc">
          Location
        </label>
        <input id="flt-loc" className={input} placeholder="City or remote" value={location} onChange={(e) => onChange("location", e.target.value)} />
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-skills">
          Skills
        </label>
        <input id="flt-skills" className={input} placeholder="react, node…" value={skills} onChange={(e) => onChange("skills", e.target.value)} />
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-cat">
          Category
        </label>
        <input id="flt-cat" className={input} placeholder="Engineering" value={category} onChange={(e) => onChange("category", e.target.value)} />
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-exp">
          Experience
        </label>
        <input id="flt-exp" className={input} placeholder="e.g. 2-4" value={experience} onChange={(e) => onChange("experience", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={row}>
          <label className={label} htmlFor="flt-min">
            Min salary (₹)
          </label>
          <input id="flt-min" type="number" className={input} placeholder="0" value={minSalary} onChange={(e) => onChange("minSalary", e.target.value)} />
        </div>
        <div className={row}>
          <label className={label} htmlFor="flt-max">
            Max salary (₹)
          </label>
          <input id="flt-max" type="number" className={input} placeholder="—" value={maxSalary} onChange={(e) => onChange("maxSalary", e.target.value)} />
        </div>
      </div>

      <div className={row}>
        <label className={label} htmlFor="flt-mode">
          Work mode
        </label>
        <select id="flt-mode" className={input} value={workMode} onChange={(e) => onChange("workMode", e.target.value)}>
          <option value="">Any</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>
    </div>
  );
}
