import { Block } from "@/store/blockRegistry";
import { analyzeBlocks } from "./lintAnalyzer";

export interface HealthCheck {
  id: string;
  label: string;
  hint: string;
  done: boolean;
  weight: number;
}

export interface HealthReport {
  score: number; // 0–100
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  checks: HealthCheck[];
  passed: number;
  total: number;
  errorCount: number;
}

function hasText(v: unknown, min = 1): boolean {
  return typeof v === "string" && v.trim().length >= min;
}

/**
 * Scores a README composed of blocks against the sections that make a
 * project README complete and readable. Returns a 0–100 score, letter
 * grade, and an actionable checklist for the sidebar.
 */
export function analyzeHealth(blocks: Block[]): HealthReport {
  const byType = (t: string) => blocks.filter((b) => b.type === t);
  const anyText = blocks
    .filter((b) => b.type === "text")
    .map((b) => (b.props?.content as string) || "")
    .join("\n")
    .toLowerCase();

  const header = byType("header")[0];
  const hasTitle = !!header && hasText(header.props?.title);
  const hasTagline =
    (!!header && hasText(header.props?.subtitle, 8)) ||
    byType("text").some((b) => hasText(b.props?.content, 40));

  const badges = byType("badges")[0];
  const repoRegex = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/;
  const hasBadges =
    !!badges && repoRegex.test((badges.props?.githubRepo || "").trim());

  const hasInstall =
    byType("code").length > 0 ||
    /```|npm i|npm install|pnpm|yarn add|pip install|cargo add/.test(anyText);

  const hasUsage =
    /usage|example|getting started|quick start/.test(anyText) ||
    byType("code").length > 1;

  const hasVisual =
    byType("image").length > 0 ||
    byType("video").length > 0 ||
    byType("githubstats").length > 0 ||
    byType("chart").length > 0;

  const hasTech = byType("techstack").length > 0;

  const hasCommunity =
    byType("contributors").length > 0 ||
    byType("sponsors").length > 0 ||
    byType("socials").length > 0;

  const hasLicense = /license|mit|apache|gpl|bsd|licence/.test(anyText);

  const errorCount = analyzeBlocks(blocks).filter(
    (w) => w.severity === "error"
  ).length;
  const clean = errorCount === 0 && blocks.length > 0;

  const checks: HealthCheck[] = [
    { id: "title", label: "Project title", hint: "Add a Header block with a clear title.", done: hasTitle, weight: 18 },
    { id: "tagline", label: "Description / tagline", hint: "Say what the project does in one line.", done: hasTagline, weight: 14 },
    { id: "badges", label: "Status badges", hint: "Add a Badges block with an owner/repo.", done: hasBadges, weight: 10 },
    { id: "install", label: "Install steps", hint: "Add a Code block with install commands.", done: hasInstall, weight: 16 },
    { id: "usage", label: "Usage / examples", hint: "Show how to use it with an example.", done: hasUsage, weight: 12 },
    { id: "visual", label: "A visual", hint: "Add a screenshot, GIF, or stats card.", done: hasVisual, weight: 10 },
    { id: "tech", label: "Tech stack", hint: "Add a Tech Stack block.", done: hasTech, weight: 6 },
    { id: "community", label: "Community", hint: "Add contributors, sponsors, or socials.", done: hasCommunity, weight: 6 },
    { id: "license", label: "License", hint: "Mention the license in a Text block.", done: hasLicense, weight: 6 },
    { id: "clean", label: "No lint errors", hint: "Resolve error-level lint warnings.", done: clean, weight: 2 },
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => (c.done ? s + c.weight : s), 0);
  const score = blocks.length === 0 ? 0 : Math.round((earned / total) * 100);

  let grade: HealthReport["grade"];
  let label: string;
  if (score >= 90) { grade = "A"; label = "Ship-ready"; }
  else if (score >= 75) { grade = "B"; label = "Looking good"; }
  else if (score >= 55) { grade = "C"; label = "Getting there"; }
  else if (score >= 30) { grade = "D"; label = "Needs work"; }
  else { grade = "F"; label = "Just getting started"; }

  return {
    score,
    grade,
    label,
    checks,
    passed: checks.filter((c) => c.done).length,
    total: checks.length,
    errorCount,
  };
}
