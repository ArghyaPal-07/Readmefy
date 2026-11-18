import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Eye,
  FileCheck2,
  GitBranch,
  LayoutTemplate,
  Package,
  Rocket,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import GithubIcon from "@/components/GithubIcon";
import { SiteHeader } from "@/components/landing/site-header";

const FEATURES = [
  {
    icon: Blocks,
    title: "Build one section at a time",
    description:
      "Add headings, code, tables, and badges as editable blocks. Drag them into the order that tells your project's story.",
  },
  {
    icon: Eye,
    title: "Check the result as you go",
    description:
      "Review your README in a GitHub-style preview, with desktop and mobile widths and light or dark backgrounds.",
  },
  {
    icon: Sparkles,
    title: "Give your first draft a head start",
    description:
      "Import a public GitHub repository to draft a starting layout from its details, then edit every section yourself.",
  },
  {
    icon: LayoutTemplate,
    title: "Skip the empty page",
    description:
      "Choose a starter for your app, package, command-line tool, or profile. Keep what fits and change the rest.",
  },
  {
    icon: FileCheck2,
    title: "Catch the little things",
    description:
      "Spot missing image descriptions, heading gaps, and empty sections with helpful checks while you work.",
  },
  {
    icon: GitBranch,
    title: "Take your README with you",
    description:
      "Copy the Markdown, download a README.md, or connect GitHub when you're ready to publish to your repository.",
  },
];

const STEPS = [
  {
    title: "Choose your starting point",
    description:
      "Start with a layout that suits your project, or add your first block to a blank canvas.",
  },
  {
    title: "Shape the story",
    description:
      "Write your content, arrange the sections, and switch to the preview to see how it all reads together.",
  },
  {
    title: "Make it part of your repo",
    description:
      "Download your README.md or publish through GitHub. Come back to your saved canvas whenever it needs an update.",
  },
];

const TEMPLATES = [
  {
    id: "cli-tool",
    name: "Command-line tools",
    tag: "CLI",
    icon: Terminal,
    description:
      "Explain what your tool does, show the first command, and help developers get up and running.",
    badges: ["Minimal Header", "Features", "Star Chart", "Code Block"],
  },
  {
    id: "saas-landing",
    name: "Apps & products",
    tag: "Product",
    icon: Rocket,
    description:
      "Introduce your product, walk through its capabilities, and give contributors a clear place to start.",
    badges: ["Hero", "Feature Grid", "Tech Stack", "CTA"],
  },
  {
    id: "profile-readme",
    name: "Developer profiles",
    tag: "Profile",
    icon: User,
    description:
      "Put a face to your work with an introduction, project highlights, and links to find you elsewhere.",
    badges: ["Gradient Banner", "Bio", "Sponsors", "Links"],
  },
  {
    id: "npm-package",
    name: "Packages & libraries",
    tag: "Package",
    icon: Package,
    description:
      "Cover installation, a useful code example, and the essentials people need before adding your package.",
    badges: ["Badges", "Install", "Usage", "License"],
  },
] as const;

export default function Page() {
  return (
    <div className="homepage min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="homepage-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]"
          />
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center duration-700 animate-in fade-in slide-in-from-bottom-3">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand">Your repo, well introduced</p>
              <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Build beautiful GitHub READMEs,{" "}
                <span className="text-brand">visually.</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                Create a professional README on an intuitive visual canvas.
                Add blocks, make it yours, and export Markdown ready for GitHub.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button size="lg" className="btn-brand w-full rounded-lg px-6 sm:w-auto" render={<Link href="/studio" />}>
                  Create your README
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-lg px-6 sm:w-auto"
                  render={<Link href="#templates" />}
                >
                  <LayoutTemplate className="size-4" />
                  Find a starting point
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">No sign-up needed to build. Your work stays in your browser.</p>
            </div>

            <div className="relative mx-auto mt-16 max-w-5xl duration-1000 animate-in fade-in slide-in-from-bottom-6">
              <div className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between px-3 py-2.5 text-xs text-muted-foreground"><span className="font-mono">README.md</span><span>Made in the visual studio</span></div>
                <Image
                  src="/studio-preview-v2.png"
                  alt="Readmefy studio — drag-and-drop block editor with live GitHub preview and block properties panel"
                  width={3024}
                  height={1890}
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="w-full rounded-xl border border-border"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">Why Readmefy</p>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Less formatting. More explaining what you built.
            </h2>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Keep your attention on the project. Readmefy takes care of the structure, so your next visitor knows where to begin.</p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand/50"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">The workflow</p>
              <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                A simple path from idea to README.md.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-brand/30 bg-background font-mono text-sm font-semibold tabular-nums text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < STEPS.length - 1 ? (
                      <span className="hidden h-px flex-1 bg-border md:block" />
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand">Starter layouts</p>
              <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                A useful head start for whatever you&apos;re building.
              </h2>
            </div>
            <Button variant="ghost" className="self-start rounded-full text-muted-foreground hover:text-foreground sm:self-auto" render={<Link href="/studio" />}>
              Explore the library
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => (
              <Link
                key={template.id}
                href={`/studio?template=${template.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand/60 hover:bg-accent"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-lg border border-border bg-muted text-brand">
                    <template.icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {template.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold">{template.name}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:22px_22px] opacity-50 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000,transparent)]"
            />
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Give your next project a proper introduction.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
              Start with a few blocks. Leave with a README that helps people understand, use, and contribute to your work.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="btn-brand w-full rounded-lg px-6 sm:w-auto" render={<Link href="/studio" />}>
                Open your canvas
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 5h16" />
                <path d="M4 12h10" />
                <path d="M4 19h7" />
              </svg>
            </span>
            <span className="text-[15px]">Readmefy</span>
          </Link>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <Link href="#features" className="transition-colors hover:text-foreground">Why Readmefy</Link>
            <Link href="#templates" className="transition-colors hover:text-foreground">Starter layouts</Link>
            <Link href="/studio" className="transition-colors hover:text-foreground">Studio</Link>
            <Link
              href="https://github.com/ArghyaPal-07/Readmefy"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-5" />
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Readmefy
          </p>
        </div>
      </footer>
    </div>
  );
}
