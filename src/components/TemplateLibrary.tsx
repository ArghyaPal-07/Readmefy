import React, { useState } from "react";
import { useReadmeStore, TemplateType } from "@/store/readmeStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Terminal,
  User,
  Sparkles,
  Rocket,
  Package,
  Video,
  BrainCircuit,
  BookOpen,
  List,
  Gamepad2,
  Puzzle,
  Bot,
  Smartphone,
  Boxes,
  Trophy,
  Globe,
  Code2,
  Server,
  GitBranch,
  Star,
  Search,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type ColorKey =
  | "blue" | "purple" | "cyan" | "emerald" | "amber" | "rose"
  | "indigo" | "orange" | "violet" | "pink" | "teal" | "red" | "slate";

const COLOR_CLASSES: Record<ColorKey, { icon: string; badge: string; hover: string; btn: string }> = {
  blue: { icon: "bg-blue-950/20 border-blue-900/50 text-blue-400", badge: "text-blue-400/80 bg-blue-950/30 border-blue-900/30", hover: "hover:border-blue-500/50", btn: "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" },
  purple: { icon: "bg-purple-950/20 border-purple-900/50 text-purple-400", badge: "text-purple-400/80 bg-purple-950/30 border-purple-900/30", hover: "hover:border-purple-500/50", btn: "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10" },
  cyan: { icon: "bg-cyan-950/20 border-cyan-900/50 text-cyan-400", badge: "text-cyan-400/80 bg-cyan-950/30 border-cyan-900/30", hover: "hover:border-cyan-500/50", btn: "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10" },
  emerald: { icon: "bg-emerald-950/20 border-emerald-900/50 text-emerald-400", badge: "text-emerald-400/80 bg-emerald-950/30 border-emerald-900/30", hover: "hover:border-emerald-500/50", btn: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10" },
  amber: { icon: "bg-amber-950/20 border-amber-900/50 text-amber-400", badge: "text-amber-400/80 bg-amber-950/30 border-amber-900/30", hover: "hover:border-amber-500/50", btn: "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" },
  rose: { icon: "bg-rose-950/20 border-rose-900/50 text-rose-400", badge: "text-rose-400/80 bg-rose-950/30 border-rose-900/30", hover: "hover:border-rose-500/50", btn: "text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" },
  indigo: { icon: "bg-indigo-950/20 border-indigo-900/50 text-indigo-400", badge: "text-indigo-400/80 bg-indigo-950/30 border-indigo-900/30", hover: "hover:border-indigo-500/50", btn: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10" },
  orange: { icon: "bg-orange-950/20 border-orange-900/50 text-orange-400", badge: "text-orange-400/80 bg-orange-950/30 border-orange-900/30", hover: "hover:border-orange-500/50", btn: "text-orange-400 hover:text-orange-300 hover:bg-orange-400/10" },
  violet: { icon: "bg-violet-950/20 border-violet-900/50 text-violet-400", badge: "text-violet-400/80 bg-violet-950/30 border-violet-900/30", hover: "hover:border-violet-500/50", btn: "text-violet-400 hover:text-violet-300 hover:bg-violet-400/10" },
  pink: { icon: "bg-pink-950/20 border-pink-900/50 text-pink-400", badge: "text-pink-400/80 bg-pink-950/30 border-pink-900/30", hover: "hover:border-pink-500/50", btn: "text-pink-400 hover:text-pink-300 hover:bg-pink-400/10" },
  teal: { icon: "bg-teal-950/20 border-teal-900/50 text-teal-400", badge: "text-teal-400/80 bg-teal-950/30 border-teal-900/30", hover: "hover:border-teal-500/50", btn: "text-teal-400 hover:text-teal-300 hover:bg-teal-400/10" },
  red: { icon: "bg-red-950/20 border-red-900/50 text-red-400", badge: "text-red-400/80 bg-red-950/30 border-red-900/30", hover: "hover:border-red-500/50", btn: "text-red-400 hover:text-red-300 hover:bg-red-400/10" },
  slate: { icon: "bg-slate-800/40 border-slate-700/50 text-slate-300", badge: "text-slate-300/80 bg-slate-800/40 border-slate-700/40", hover: "hover:border-slate-500/50", btn: "text-slate-300 hover:text-slate-200 hover:bg-slate-400/10" },
};

interface TemplateMeta {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorKey;
  badges: string[];
}

const TEMPLATES: TemplateMeta[] = [
  { id: "open-source", name: "Open Source Library", description: "The complete OSS starter — badges, TOC, features, contributors and a language chart.", icon: Star, color: "blue", badges: ["Badges", "Contributors", "Chart", "TOC"] },
  { id: "saas-landing", name: "Product / SaaS", description: "A converting layout for digital products with bold headers, feature grids, and CTAs.", icon: Rocket, color: "cyan", badges: ["Hero", "Feature Grid", "Tech Stack"] },
  { id: "profile-readme", name: "GitHub Profile", description: "A personalized intro for your profile page — gradient banner, bio, and sponsors grid.", icon: User, color: "purple", badges: ["Gradient", "Bio", "Sponsors"] },
  { id: "ai-ml", name: "AI / ML Project", description: "Research-grade layout with benchmark tables, model cards, quickstart and citation.", icon: BrainCircuit, color: "violet", badges: ["Benchmarks", "Citation", "PyTorch"] },
  { id: "cli-tool", name: "CLI Developer Tool", description: "For command-line utilities — install commands, usage examples and options tables.", icon: Terminal, color: "emerald", badges: ["Install", "Usage", "Options"] },
  { id: "npm-package", name: "NPM Package", description: "A clean TypeScript package skeleton with install, usage, and an options table.", icon: Package, color: "red", badges: ["TypeScript", "Install", "API"] },
  { id: "python-lib", name: "Python Package", description: "PyPI-ready layout with pip install, usage snippets, and a function reference table.", icon: Code2, color: "amber", badges: ["pip", "Usage", "API"] },
  { id: "react-component", name: "React Component", description: "Document a component library with props tables and live usage examples.", icon: Code2, color: "cyan", badges: ["Props", "Usage", "Preview"] },
  { id: "rest-api-2", name: "REST API", description: "Endpoint reference, auth, request/response examples and status codes.", icon: Server, color: "teal", badges: ["Endpoints", "Auth", "Examples"] },
  { id: "web3-solana", name: "Web3 / Solana", description: "For dApps and protocols — chain badges, tech stack, and contract details.", icon: Globe, color: "violet", badges: ["Web3", "Solana", "Rust"] },
  { id: "mobile-app", name: "Mobile App", description: "Cross-platform app README with screenshots, setup, and store badges.", icon: Smartphone, color: "blue", badges: ["Setup", "Screens", "Stores"] },
  { id: "game-dev", name: "Game Project", description: "Immersive cover banner, controls table, build steps and a gameplay trailer.", icon: Gamepad2, color: "rose", badges: ["Cover", "Controls", "Trailer"] },
  { id: "docs-site", name: "Documentation", description: "A docs-style layout with config tables, callouts, and a roadmap checklist.", icon: BookOpen, color: "indigo", badges: ["Config", "Roadmap", "Guide"] },
  { id: "awesome-list", name: "Awesome List", description: "The classic curated-list format with contents, categories, and contributing.", icon: List, color: "amber", badges: ["Curated", "Contents", "Links"] },
  { id: "portfolio", name: "Portfolio", description: "Personal showcase with a bold banner and live GitHub stats card.", icon: User, color: "pink", badges: ["Banner", "Stats", "Links"] },
  { id: "monorepo", name: "Monorepo", description: "Turborepo-style workspace overview with package tree and tooling.", icon: Boxes, color: "orange", badges: ["Workspaces", "Turbo", "Docker"] },
  { id: "hackathon-2", name: "Hackathon Project", description: "Judge-friendly template — problem, solution, demo, and team.", icon: Trophy, color: "emerald", badges: ["Problem", "Demo", "Team"] },
  { id: "browser-ext", name: "Browser Extension", description: "For Chrome/Firefox add-ons — install steps and permissions.", icon: Puzzle, color: "slate", badges: ["Install", "Permissions"] },
  { id: "vscode-ext", name: "VS Code Extension", description: "Marketplace-ready layout with features and install instructions.", icon: Puzzle, color: "blue", badges: ["Features", "Marketplace"] },
  { id: "discord-bot", name: "Discord Bot", description: "Bot README with command list, invite link, and tech stack.", icon: Bot, color: "indigo", badges: ["Commands", "Invite", "Stack"] },
  { id: "youtube-channel", name: "YouTube Channel", description: "For creators — channel banner, latest video embed, and socials.", icon: Video, color: "red", badges: ["Banner", "Video", "Socials"] },
  { id: "modern-toolkit", name: "Modern Toolkit", description: "A polished all-rounder with features, install, contributing and license.", icon: GitBranch, color: "purple", badges: ["Features", "Install", "License"] },
  { id: "npm-package-2", name: "Minimal Package", description: "A stripped-back, no-frills package README to start fast.", icon: Package, color: "red", badges: ["Minimal", "Fast"] },
];

export default function TemplateLibrary({ isOpen, onClose }: TemplateLibraryProps) {
  const { loadTemplate } = useReadmeStore();
  const [query, setQuery] = useState("");

  const handleSelectTemplate = (id: TemplateType, name: string) => {
    loadTemplate(id);
    toast.success(`Loaded "${name}" template!`, {
      description: "Your workspace has been populated with starter blocks.",
    });
    onClose();
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? TEMPLATES.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.badges.some((b) => b.toLowerCase().includes(q))
      )
    : TEMPLATES;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-5xl sm:max-w-5xl max-h-[85vh] overflow-y-auto custom-scrollbar bg-panel border-border text-foreground select-none rounded-xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
            <LayoutGrid className="w-5 h-5 text-indigo-500" />
            Template Library
            <span className="ml-1 text-xs font-normal text-muted-foreground">{TEMPLATES.length} templates</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1.5">
            Choose a starting template to kickstart your project.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search templates"
            placeholder="Search templates…"
            className="w-full bg-card border border-border rounded-lg h-10 pl-10 pr-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No templates match “{query}”.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const c = COLOR_CLASSES[t.color];
              const Icon = t.icon;
              return (
                <button
                  type="button"
                  aria-label={`Load ${t.name} template`}
                  key={t.id}
                  onClick={() => handleSelectTemplate(t.id, t.name)}
                  className={`text-left flex flex-col p-5 rounded-xl border border-border bg-card hover:bg-accent ${c.hover} transition-all cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg border ${c.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium h-7 px-3 flex items-center rounded-md ${c.btn}`}>
                      Load
                    </span>
                  </div>

                  <h4 className="font-semibold text-base text-white mt-2 transition-colors">{t.name}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed flex-1">{t.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {t.badges.map((badge, idx) => (
                      <span key={idx} className={`text-[10px] font-mono font-medium border px-2 py-1 rounded-md ${c.badge}`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
