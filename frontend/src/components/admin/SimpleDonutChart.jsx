/** SVG donut chart — values as counts; labels in legend. */
export default function SimpleDonutChart({ title, subtitle, data, colors }) {
  const rows = (Array.isArray(data) ? data : []).filter((r) => Number(r.value ?? r.count) > 0);
  const total = rows.reduce((s, r) => s + Number(r.value ?? r.count ?? 0), 0) || 1;
  const palette = colors || ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#64748b", "#8b5cf6", "#14b8a6"];
  let acc = 0;
  const segs = rows.map((r, i) => {
    const v = Number(r.value ?? r.count ?? 0);
    const start = (acc / total) * Math.PI * 2;
    acc += v;
    const end = (acc / total) * Math.PI * 2;
    return { ...r, v, start, end, color: palette[i % palette.length] };
  });

  const r = 52;
  const cx = 64;
  const cy = 64;
  const arcPath = (start, end) => {
    const x1 = cx + r * Math.cos(start - Math.PI / 2);
    const y1 = cy + r * Math.sin(start - Math.PI / 2);
    const x2 = cx + r * Math.cos(end - Math.PI / 2);
    const y2 = cy + r * Math.sin(end - Math.PI / 2);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex min-h-[240px] flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {!segs.length ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-500">
          No category data
        </div>
      ) : (
        <div className="flex flex-1 flex-wrap items-center justify-center gap-6">
          <svg viewBox="0 0 128 128" className="h-36 w-36 shrink-0 drop-shadow-sm">
            {segs.map((s, i) => (
              <path key={i} d={arcPath(s.start, s.end)} fill={s.color} className="transition-opacity hover:opacity-90" />
            ))}
            <circle cx={cx} cy={cy} r={28} fill="white" className="shadow-inner" />
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-400 text-[10px] font-medium">
              Total
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" className="fill-slate-900 text-[13px] font-bold">
              {total}
            </text>
          </svg>
          <ul className="min-w-0 flex-1 space-y-2 text-xs">
            {segs.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="truncate font-medium text-slate-700">{s.label ?? s.category}</span>
                </span>
                <span className="shrink-0 tabular-nums text-slate-500">{s.v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
