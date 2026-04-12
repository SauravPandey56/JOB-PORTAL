import { useLayoutEffect, useRef, useState } from "react";

/**
 * Sets `visible` when the element scrolls into view (for section animations).
 * Uses useLayoutEffect so the ref is attached before we observe (avoids blank first paint).
 * @param {{ once?: boolean, threshold?: number, rootMargin?: string, initialVisible?: boolean }} options
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(options.initialVisible === true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const { once = true, threshold = 0.1, rootMargin = "0px 0px -48px 0px", initialVisible = false } = options;

    if (initialVisible) {
      setVisible(true);
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options.once, options.threshold, options.rootMargin, options.initialVisible]);

  return [ref, visible];
}
