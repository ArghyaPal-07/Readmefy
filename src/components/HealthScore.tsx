"use client";

import React from "react";
import { Check, Circle, Sparkles } from "lucide-react";
import { useReadmeStore } from "@/store/readmeStore";
import { analyzeHealth } from "@/utils/readmeHealth";

/**
 * README Health Score — a gradient ring grade plus an actionable checklist.
 * Rendered in the right sidebar when no block is selected, turning an empty
 * state into useful guidance.
 */
export default function HealthScore() {
  const blocks = useReadmeStore((s) => s.blocks);
  const report = React.useMemo(() => analyzeHealth(blocks), [blocks]);

  const R = 30;
  const C = 2 * Math.PI * R;
  const offset = C - (report.score / 100) * C;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <h3 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          README Health
        </h3>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4">
        <div className="relative shrink-0">
          <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
            <circle cx="38" cy="38" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
            <circle
              cx="38"
              cy="38"
              r={R}
              fill="none"
              stroke="url(#healthGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
            />
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--brand)" />
                <stop offset="100%" stopColor="var(--brand-2)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold leading-none text-white">{report.score}</span>
            <span className="text-[9px] text-neutral-500 leading-none mt-0.5">/ 100</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-brand-gradient">{report.grade}</span>
            <span className="text-sm font-semibold text-white truncate">{report.label}</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {report.passed} of {report.total} essentials done
            {report.errorCount > 0 ? ` · ${report.errorCount} error${report.errorCount > 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-1">
        {report.checks.map((c) => (
          <li
            key={c.id}
            className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5"
            title={c.hint}
          >
            <span
              className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${
                c.done
                  ? "bg-brand-gradient text-white"
                  : "border border-border text-neutral-600"
              }`}
            >
              {c.done ? <Check className="size-2.5" strokeWidth={3} /> : <Circle className="size-1.5 fill-current" />}
            </span>
            <span className="min-w-0">
              <span className={`block text-xs ${c.done ? "text-neutral-300 line-through decoration-neutral-700" : "text-neutral-300"}`}>
                {c.label}
              </span>
              {!c.done && (
                <span className="block text-[10px] leading-snug text-neutral-500">{c.hint}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
