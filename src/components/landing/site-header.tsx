"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import GithubIcon from "@/components/GithubIcon";

const NAV_LINKS = [
  { label: "Why Readmefy", href: "#features" },
  { label: "The workflow", href: "#how-it-works" },
  { label: "Starter layouts", href: "#templates" },
];

const subscribeToHydration = () => () => {};

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  // Stored themes are available only in the browser. Match the server's first
  // render before showing the icon and label for the saved preference.
  const hydrated = React.useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const isLight = hydrated && resolvedTheme === "light";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 5h16" />
              <path d="M4 12h10" />
              <path d="M4 19h7" />
            </svg>
          </span>
          <span className="text-sm sm:text-[15px]">Readmefy</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            title={isLight ? "Switch to dark theme" : "Switch to light theme"}
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            onClick={() => signIn("github", { callbackUrl: "/studio" })}
          >
            <GithubIcon className="size-4" />
            Sign in
          </Button>
          <Button size="sm" className="btn-brand rounded-lg" render={<Link href="/studio" />}>
            Open Studio
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="rounded-lg lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-border/60 bg-background/95 px-4 py-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label === "GitHub" ? <GithubIcon className="size-4" /> : null}
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setOpen(false);
                  signIn("github", { callbackUrl: "/studio" });
                }}
              >
                <GithubIcon className="size-4" />
                Sign in
              </Button>
              <Button className="w-full rounded-full" render={<Link href="/studio" onClick={() => setOpen(false)} />}>
                Open Studio
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
