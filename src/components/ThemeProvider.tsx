"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="readmefy-theme"
      disableTransitionOnChange
      forcedTheme={pathname === "/" ? undefined : "dark"}
    >
      {children}
    </NextThemeProvider>
  );
}
