/** Lightweight SVG line chart (no external deps). */
export default function SimpleLineChart({ title, subtitle, data, stroke = "#0ea5e9" }) {
  const rows = Array.isArray(data) ? data : [];
  const w = 320;
  const h = 140;
  const pad = 12;
  const max = Math.max(1, ...rows.map((r) => Number(r.value ?? r.count ?? 0)));
  const pts = rows.map((r, i) => {
    const x = pad + (i / Math.max(1, rows.length - 1)) * (w - pad * 2);
    const v = Number(r.value ?? r.count ?? 0);
    const y = pad + (1 - v / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const d = pts.length ? `M ${pts.join(" L ")}` : "";

  return (
    <div className="flex h-full min-h-[220px] flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {!rows.length ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-500">
          No trend data yet
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-end">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="adminLineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            {d ? (
              <>
                <path
                  d={`${d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`}
                  fill="url(#adminLineFill)"
                  className="transition-opacity duration-500"
                />
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm"
                />
              </>
            ) : null}
          </svg>
          <div className="mt-2 flex justify-between gap-1 text-[10px] font-medium text-slate-400">
            {rows.map((r) => (
              <span key={r.label} className="max-w-[3.5rem] truncate text-center">
                {r.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
