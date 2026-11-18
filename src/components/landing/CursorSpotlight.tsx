"use client";

import * as React from "react";

/**
 * A soft brand-colored glow that tracks the cursor within its parent section.
 * Absolutely positioned to fill the section; respects reduced-motion.
 */
export function CursorSpotlight() {
  const ref = React.useRef<HTMLDivElement>(null);
  const raf = React.useRef(0);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setPos(inside ? { x, y } : null));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
      style={{
        opacity: pos ? 1 : 0,
        background: pos
          ? `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--brand) 16%, transparent), transparent 65%)`
          : undefined,
      }}
    />
  );
}
