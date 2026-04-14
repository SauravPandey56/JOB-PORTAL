export default function AdminStatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-105 border border-indigo-100/50">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-500 whitespace-normal break-words leading-tight uppercase tracking-wider">{label}</p>
          <div className="mt-1 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 flex-wrap">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">{value}</p>
            {trend && (
               <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50/80 border border-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                 {trend}
               </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
