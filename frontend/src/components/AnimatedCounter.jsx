import { useEffect, useState } from "react";

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export default function AnimatedCounter({ end, duration = 1400, suffix = "", prefix = "", decimals = 0, active }) {
  const [value, setValue] = useState(0);
  const safeEnd = Number.isFinite(Number(end)) ? Number(end) : 0;

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setValue(safeEnd * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, safeEnd, duration]);

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value || 0).toLocaleString();

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
