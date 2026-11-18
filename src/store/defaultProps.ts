import { BlockType } from "./blockRegistry";

export const DEFAULT_BLOCK_PROPS: Record<BlockType, Record<string, any>> = {
  header: {
    style: "gradient",
    title: "My Awesome Project",
    subtitle: "A modern developer tool built to make documentation visual, elegant, and fast.",
    logoType: "auto",
    logoUrl: "",
    bgType: "color",
    bgImage: "",
    bgGradientStart: "#4f46e5",
    bgGradientEnd: "#ec4899",
    bgColor: "#111827",
    size: "banner",
    theme: "dark",
    align: "center",
    font: "inter",
    border: true,
    watermark: false,
    altText: "Logo",
    titleColor: "#ffffff",
    subtitleColor: "#d4d4d8",
    titleSize: "lg",
    logoSize: 64,
    logoShape: "rounded",
    overlay: 15,
    rounded: "lg",
    textShadow: true,
  },
  text: {
    content: `## 🚀 Features

- **Visual Editor**: Easily edit each section with dedicated forms.
- **Instant Preview**: Toggle between design preview, compiled HTML, and markdown modes.
- **Templates**: Get started quickly with specialized configurations.
- **Copy & Download**: Export your README with a single click.

## 🛠️ Installation

\`\`\`bash
npm install readme-studio
\`\`\`
`,
  },
  badges: {
    packageName: "lucide-react",
    githubRepo: "lucide-icons/lucide",
    badgeList: ["npm-v", "github-stars", "license"],
    badgeStyle: "flat",
    align: "left",
    gap: "normal",
    badgeColor: "",
  },
  group: {
    title: "Layout Container",
  },
  chart: {
    username: "torvalds",
    chartType: "repos-per-language",
    theme: "github_dark",
  },
  table: {
    headers: ["Option", "Description", "Default"],
    rows: [
      ["`theme`", "Visual theme (dark / light)", "`dark`"],
      ["`align`", "Alignment (left / center / right)", "`center`"],
      ["`border`", "Show top visual divider border", "`true`"],
    ],
  },
  image: {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    caption: "A premium header design built with Readmefy.",
    align: "center",
    width: "100%",
  },
  sponsors: {
    layout: "grid",
    title: "Our Sponsors",
    logoSize: 64,
    logoShape: "circle",
    showNames: true,
    align: "center",
    sponsors: [
      {
        name: "Acme Corp",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&fit=crop&q=80",
        link: "https://github.com",
      },
      {
        name: "Stark Industries",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&fit=crop&q=80",
        link: "https://github.com",
      },
    ],
  },
  
  // 8 New Block Props
  techstack: {
    techs: "React, TypeScript, Node.js, PostgreSQL",
    layout: "row",
    iconSize: 40,
    showLabel: true,
  },
  contributors: {
    repo: "vercel/next.js",
    maxCount: 12,
    avatarSize: 48,
  },
  socials: {
    layout: "row",
    badgeStyle: "for-the-badge",
    align: "center",
    logoOnly: false,
    items: [
      { platform: "Twitter/X", url: "https://twitter.com/dev", label: "Twitter" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/dev", label: "LinkedIn" },
      { platform: "GitHub", url: "https://github.com/dev", label: "GitHub" },
      { platform: "Discord", url: "https://discord.gg/dev", label: "Discord" }
    ],
  },
  roadmap: {
    items: [
      { text: "Design visual layout templates", done: true },
      { text: "Integrate Monaco Markdown Sync", done: false },
      { text: "Add publishing flow to GitHub", done: false }
    ],
  },
  divider: {
    style: "line",
    height: 24,
    color: "#262626",
  },
  video: {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "Demo Walkthrough Video",
    width: 100,
    align: "center",
  },
  code: {
    language: "typescript",
    filename: "src/index.ts",
    code: `const startStudio = () => {
  console.log("Readmefy is running!");
};

startStudio();`,
    showLineNumbers: true,
    theme: "github-dark",
    wrap: false,
    showChrome: true,
    caption: "",
  },
  githubstats: {
    username: "torvalds",
    theme: "github_dark",
    statsType: "stats",
  },

  // Dynamic / profile components
  typing: {
    lines: "Full-Stack Developer;Open Source Enthusiast;Always Learning",
    color: "6366F1",
    size: 26,
    font: "Fira Code",
    center: true,
    width: 500,
  },
  activity: {
    username: "username",
    theme: "github-compact",
    hideBorder: true,
  },
  views: {
    username: "username",
    label: "Profile Views",
    color: "6366F1",
    style: "flat",
  },
  support: {
    buymeacoffee: "username",
    kofi: "",
    paypal: "",
  },
};
