export default function SimpleBarChart({ title, subtitle, data, emptyLabel = "No data yet", accent = "bg-primary" }) {
  const rows = Array.isArray(data) ? data : [];
  const max = Math.max(1, ...rows.map((r) => Number(r.value ?? r.count ?? 0)));

  return (
    <div className="flex h-full min-h-[200px] flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {!rows.length ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <ul className="flex flex-1 flex-col justify-center gap-3">
          {rows.map((row) => {
            const label = row.label ?? row.category ?? row.name ?? "—";
            const raw = Number(row.value ?? row.count ?? 0);
            const pct = Math.round((raw / max) * 100);
            return (
              <li key={label} className="group">
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-slate-700">{label}</span>
                  <span className="shrink-0 tabular-nums text-slate-500">{raw}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-90",
                      accent,
                    ].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
