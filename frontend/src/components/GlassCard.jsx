export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

