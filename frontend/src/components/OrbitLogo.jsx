/**
 * Animated “orbit” mark: core circle + satellite dot (CSS only).
 */
export default function OrbitLogo({ className = "", size = 56 }) {
  const s = `${size}px`;
  return (
    <div
      className={["relative shrink-0", className].filter(Boolean).join(" ")}
      style={{ width: s, height: s }}
      aria-hidden
    >
      <div
        className="absolute rounded-full bg-gradient-to-br from-primary via-indigo-500 to-violet-600 shadow-lg shadow-primary/25"
        style={{
          inset: `${Math.round(size * 0.28)}px`,
        }}
      />
      <div
        className="absolute inset-0 animate-orbit-spin"
        style={{ animationDuration: `${3.2 + size / 80}s` }}
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-white shadow-md ring-2 ring-primary/40"
          style={{
            width: Math.max(7, Math.round(size * 0.14)),
            height: Math.max(7, Math.round(size * 0.14)),
            boxShadow: "0 0 14px rgba(37, 99, 235, 0.45)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-full border border-primary/20" />
    </div>
  );
}
