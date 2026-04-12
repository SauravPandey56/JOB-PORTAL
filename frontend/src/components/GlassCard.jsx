export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200/90 bg-white shadow-card backdrop-blur-sm transition duration-300 hover:border-primary/15 hover:shadow-card-hover",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
