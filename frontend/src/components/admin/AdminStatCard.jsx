import GlassCard from "../GlassCard.jsx";

export default function AdminStatCard({ icon: Icon, label, value, trend }) {
  return (
    <GlassCard className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/[0.06] transition group-hover:bg-primary/[0.1]" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner transition group-hover:scale-105">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
          {trend ? <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p> : null}
        </div>
      </div>
    </GlassCard>
  );
}
