"use client";

import * as React from "react";

/**
 * Applies a subtle 3D tilt toward the cursor. Used to give the hero
 * screenshot a little depth on pointer move. No-op for reduced-motion.
 */
export function TiltCard({
  children,
  className,
  max = 3,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const raf = React.useRef(0);
  const reduce = React.useRef(false);

  React.useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1400px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
