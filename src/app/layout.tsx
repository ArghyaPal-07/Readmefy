import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { APP_TITLE, APP_URL } from "@/lib/site";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const previewImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: APP_TITLE,
};

// Resolve preview URLs against the configured domain or Vercel's production host.
const metadataUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : APP_URL);

export const metadata: Metadata = {
  title: APP_TITLE,
  description:
    "Design beautiful GitHub READMEs visually with drag-and-drop blocks, a live GitHub-accurate preview, AI autofill, and one-click push. No more wrestling with raw markdown.",
  metadataBase: new URL(metadataUrl),
  keywords: [
    "README builder",
    "GitHub README generator",
    "drag and drop README",
    "markdown editor",
    "developer tools",
    "README templates",
    "GitHub profile README",
  ],
  authors: [{ name: "Readmefy" }],
  creator: "Readmefy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: metadataUrl,
    title: APP_TITLE,
    description:
      "Drag-and-drop blocks, a live GitHub-accurate preview, AI autofill, and one-click push. No more wrestling with raw markdown.",
    siteName: "Readmefy",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description:
      "Drag-and-drop blocks, a live GitHub-accurate preview, AI autofill, and one-click push. No more wrestling with raw markdown.",
    creator: "@readmely",
    images: [previewImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-background text-foreground flex flex-col font-sans"
        style={{ fontFeatureSettings: '"calt", "kern", "liga", "ss03"' }}
      >
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" closeButton />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
