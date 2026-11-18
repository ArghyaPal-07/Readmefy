import { create } from "zustand";
import { Block, BlockType } from "./blockRegistry";
import { DEFAULT_BLOCK_PROPS } from "./defaultProps";

export type TemplateType =
  | "npm-package"
  | "react-component"
  | "cli-tool"
  | "profile-readme"
  | "web3-solana"
  | "saas-landing"
  | "mobile-app"
  | "rest-api"
  | "monorepo"
  | "hackathon"
  | "portfolio"
  | "browser-ext"
  | "vscode-ext"
  | "discord-bot"
  | "youtube-channel"
  | "hackathon-2"
  | "rest-api-2"
  | "npm-package-2"
  | "modern-toolkit"
  | "ai-ml"
  | "open-source"
  | "python-lib"
  | "game-dev"
  | "docs-site"
  | "awesome-list";

export interface Project {
  id: string;
  name: string;
  blocks: Block[];
  updated_at: string;
}

type ReadmeState = {
  blocks: Block[];
  selectedBlockId: string | null;
  selectedBlockIds: string[]; // multi-select support
  copiedBlocks: Block[]; // clipboard
  history: Block[][];
  future: Block[][];

  // Project Management
  projectName: string;
  activeProjectId: string | null;
  projects: Project[];

  // Actions
  addBlock: (type: BlockType, parentId?: string) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, props: Partial<Record<string, any>>) => void;
  reorderBlocks: (fromIndex: number, toIndex: number, parentId?: string) => void;
  selectBlock: (id: string | null) => void;
  setBlocks: (blocks: Block[]) => void;
  resetStore: () => void;

  // Block notes
  updateBlockNote: (id: string, note: string) => void;

  // Multi-select & Advanced arrangement actions
  toggleMultiSelectBlock: (id: string) => void;
  clearMultiSelect: () => void;
  copySelectedBlocks: () => void;
  pasteBlocks: () => void;
  groupSelectedBlocks: () => void;
  deleteSelectedBlocks: () => void;
  moveSelectedBlocks: (direction: "up" | "down") => void;
  duplicateSelectedBlocks: () => void;

  // Project Actions
  setProjectName: (name: string) => void;
  setActiveProjectId: (id: string | null) => void;
  setProjects: (projects: Project[]) => void;
  loadProject: (id: string) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Templates
  loadTemplate: (template: TemplateType) => void;

  // Initialization
  initFromStorage: () => void;
};

const TEMPLATE_BLOCKS: Record<TemplateType, Block[]> = {
  "npm-package": [
    {
      id: "header-1",
      type: "header",
      props: {
        style: "gradient",
        title: "npm-package-boilerplate",
        subtitle: "A highly-optimized Node.js package skeleton for building high-performance CLI utilities and microservices.",
        logoType: "auto",
        logoUrl: "",
        bgType: "color",
        bgGradientStart: "#06b6d4",
        bgGradientEnd: "#3b82f6",
        bgColor: "#0f172a",
        size: "banner",
        theme: "dark",
        align: "center",
        font: "mono",
        border: true,
        watermark: false,
        altText: "Package Logo",
      },
    },
    {
      id: "badges-1",
      type: "badges",
      props: {
        packageName: "lodash",
        githubRepo: "lodash/lodash",
        badgeList: ["npm-v", "github-stars", "license", "github-status"],
        badgeStyle: "flat-square",
      },
    },
    {
      id: "text-1",
      type: "text",
      props: {
        content: `## 📦 Installation

\`\`\`bash
npm install npm-package-boilerplate
\`\`\`

## 📖 Usage

Import the main module and initialize the generator:

\`\`\`typescript
import { Boilerplate } from 'npm-package-boilerplate';

const instance = new Boilerplate({ debug: true });
await instance.run();
\`\`\`
`,
      },
    },
    {
      id: "table-1",
      type: "table",
      props: {
        headers: ["Parameter", "Type", "Description", "Required"],
        rows: [
          ["`debug`", "`boolean`", "Toggle console output logs", "No (`false`)"],
          ["`apiKey`", "`string`", "Authentication key for APIs", "Yes"],
          ["`retries`", "`number`", "Number of failed attempts before failure", "No (`3`)"],
        ],
      },
    },
  ],
  "react-component": [
    {
      id: "header-2",
      type: "header",
      props: {
        style: "solid",
        title: "React Glassmorphic Cards",
        subtitle: "A suite of premium, ultra-responsive glassmorphism cards and layout grids for React apps.",
        logoType: "custom",
        logoUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&fit=crop&q=80",
        bgType: "image",
        bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
        bgColor: "#171717",
        size: "banner",
        theme: "dark",
        align: "left",
        font: "inter",
        border: true,
        watermark: true,
        altText: "React logo",
      },
    },
    {
      id: "badges-2",
      type: "badges",
      props: {
        packageName: "react",
        githubRepo: "facebook/react",
        badgeList: ["npm-v", "github-stars", "license"],
        badgeStyle: "for-the-badge",
      },
    },
    {
      id: "text-2",
      type: "text",
      props: {
        content: `## ✨ Demo

Visual demonstration of the glass card layout:

`,
      },
    },
    {
      id: "image-1",
      type: "image",
      props: {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
        caption: "Glassmorphic Cards Preview Grid",
        align: "center",
        width: "70%",
      },
    },
  ],
  "cli-tool": [
    {
      id: "header-3",
      type: "header",
      props: {
        style: "minimal",
        title: "⚡ FAST-CLI",
        subtitle: "A super-fast developer terminal tool that automates environment setup, git hooks, and docker configs in under 2 seconds.",
        logoType: "none",
        theme: "dark",
        align: "center",
        font: "mono",
        border: true,
        watermark: false,
      },
    },
    {
      id: "text-3",
      type: "text",
      props: {
        content: `## 🚀 Quick Start

\`\`\`bash
npx fast-cli-tool create --template fullstack
\`\`\`

## 📊 Star History

Thank you to all contributors who have starred the repository!
`,
      },
    },
    {
      id: "chart-1",
      type: "chart",
      props: {
        repo: "shadcn/ui",
        theme: "dark",
      },
    },
  ],
  "profile-readme": [
    {
      id: "pr-header",
      type: "header",
      props: {
        style: "gradient",
        title: "Hi there, I'm Alex 👋",
        subtitle: "Full-Stack Engineer · Open Source Creator · Technical Writer",
        logoType: "none",
        bgType: "color",
        bgGradientStart: "#7c3aed",
        bgGradientEnd: "#db2777",
        bgColor: "#09090b",
        size: "compact",
        theme: "dark",
        align: "center",
        font: "inter",
        border: false,
        watermark: false,
        titleSize: "xl",
        textShadow: true,
      },
    },
    {
      id: "pr-typing",
      type: "typing",
      props: {
        lines: "Full-Stack Developer;Open Source Enthusiast;Coffee to Code Converter ☕;Always Learning 🚀",
        color: "7C3AED",
        size: 24,
        font: "Fira Code",
        center: true,
        width: 500,
      },
    },
    {
      id: "pr-views",
      type: "views",
      props: { username: "alexdev", label: "Profile Views", color: "7C3AED", style: "flat" },
    },
    {
      id: "pr-socials",
      type: "socials",
      props: {
        layout: "row",
        badgeStyle: "for-the-badge",
        align: "center",
        logoOnly: false,
        items: [
          { platform: "Twitter/X", url: "https://twitter.com/alexdev", label: "Twitter" },
          { platform: "LinkedIn", url: "https://linkedin.com/in/alexdev", label: "LinkedIn" },
          { platform: "Dev.to", url: "https://dev.to/alexdev", label: "Dev.to" },
          { platform: "Email", url: "mailto:alex@dev.to", label: "Email" },
        ],
      },
    },
    {
      id: "pr-about",
      type: "text",
      props: {
        content: `## 🧑‍💻 About Me

- 🔭 I'm currently working on **visual developer tools** and open-source libraries.
- 🌱 I'm deepening my knowledge of **distributed systems** and **Rust**.
- 💬 Ask me about **TypeScript, React, Next.js, Go, or system design**.
- 🎯 2025 goal: ship one meaningful open-source project every month.
- ⚡ Fun fact: I've written more markdown than actual prose.`,
      },
    },
    {
      id: "pr-stack-title",
      type: "text",
      props: { content: "## 🛠️ Tech Stack" },
    },
    {
      id: "pr-techstack",
      type: "techstack",
      props: {
        techs: "TypeScript, JavaScript, React, Next.js, Node.js, Go, Rust, Python, PostgreSQL, Redis, Docker, Kubernetes, AWS, Tailwind CSS, GraphQL",
        layout: "row",
        iconSize: 42,
        showLabel: true,
      },
    },
    {
      id: "pr-div1",
      type: "divider",
      props: { style: "line", color: "#7c3aed" },
    },
    {
      id: "pr-stats-title",
      type: "text",
      props: { content: "## 📊 GitHub Stats" },
    },
    {
      id: "pr-stats",
      type: "githubstats",
      props: { username: "torvalds", theme: "radical", statsType: "stats" },
    },
    {
      id: "pr-chart",
      type: "chart",
      props: { username: "torvalds", chartType: "most-commit-language", theme: "radical" },
    },
    {
      id: "pr-activity",
      type: "activity",
      props: { username: "torvalds", theme: "github-compact", hideBorder: true },
    },
    {
      id: "pr-projects",
      type: "text",
      props: {
        content: `## 🚀 Featured Projects

| Project | Description | Stars |
| --- | --- | --- |
| **[readmefy](https://github.com)** | Visual GitHub README builder | ⭐ 2.3k |
| **[flux-cli](https://github.com)** | Blazing-fast dev CLI toolkit | ⭐ 890 |
| **[schema-kit](https://github.com)** | Type-safe schema utilities | ⭐ 1.1k |`,
      },
    },
    {
      id: "pr-support",
      type: "support",
      props: { buymeacoffee: "alexdev", kofi: "", paypal: "" },
    },
    {
      id: "pr-footer",
      type: "text",
      props: {
        content: `---

<sub>💜 Thanks for stopping by! Feel free to explore my repos and reach out.</sub>`,
      },
    },
  ],
  // 10 new template block configurations
  "web3-solana": [
    { id: "ws-h", type: "header", props: { style: "gradient", title: "Solana Pay Portal", subtitle: "Decentralized visual payment gateway for web3 checkout screens.", bgGradientStart: "#9945FF", bgGradientEnd: "#14F195", logoType: "auto", border: true } },
    { id: "ws-b", type: "badges", props: { githubRepo: "solana-labs/solana", badgeList: ["github-stars", "license"], badgeStyle: "flat" } },
    { id: "ws-t", type: "techstack", props: { techs: "Solana, Rust, TypeScript, React", layout: "row", iconSize: 40, showLabel: true } },
    { id: "ws-txt", type: "text", props: { content: "## Web3 Payment Protocol\nSecure, instant payment configurations using Solana Pay." } }
  ],
  "saas-landing": [
    { id: "saas-h", type: "header", props: { style: "gradient", title: "MetricsFlow SaaS", subtitle: "SaaS analytics platform to measure cohort retention and pipeline values in real-time.", bgGradientStart: "#4f46e5", bgGradientEnd: "#06b6d4", logoType: "auto", border: true } },
    { id: "saas-t", type: "techstack", props: { techs: "React, Next.js, Tailwind CSS, Prisma, PostgreSQL", layout: "row", iconSize: 40, showLabel: true } },
    { id: "saas-txt", type: "text", props: { content: "## Features\n- Real-time Pipeline Tracking\n- Custom Funnels\n- Automated Email Summaries" } }
  ],
  "mobile-app": [
    { id: "mob-h", type: "header", props: { style: "solid", title: "FitTrack Mobile", subtitle: "Cross-platform mobile app for workout planning and nutrition tracking.", bgColor: "#3b82f6", logoType: "auto", border: true } },
    { id: "mob-t", type: "techstack", props: { techs: "React Native, Flutter, Firebase, Node.js", layout: "row", iconSize: 40, showLabel: true } },
    { id: "mob-txt", type: "text", props: { content: "## Setup\nRun `npm install` and then `npx react-native run-ios`." } }
  ],
  "rest-api": [
    { id: "api-h", type: "header", props: { style: "minimal", title: "GeoLocation REST API", subtitle: "Ultra-fast geolocation microservice written in Go.", border: true } },
    { id: "api-c", type: "code", props: { language: "go", filename: "main.go", code: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"API Listening on :8080\")\n}", showLineNumbers: true } },
    { id: "api-txt", type: "text", props: { content: "## Endpoints\n- `GET /api/v1/locate?ip=...` returns coordinates.\n- `GET /api/v1/health` status check." } }
  ],
  "monorepo": [
    { id: "mono-h", type: "header", props: { style: "gradient", title: "Workspace Monorepo", subtitle: "Turborepo-powered monorepo for SaaS operations, admin portals, and API services.", bgGradientStart: "#ef4444", bgGradientEnd: "#f59e0b", logoType: "auto", border: true } },
    { id: "mono-t", type: "techstack", props: { techs: "TypeScript, Turborepo, Next.js, Docker", layout: "row", iconSize: 40, showLabel: true } }
  ],
  "hackathon": [
    { id: "hack-h", type: "header", props: { style: "gradient", title: "EcoSnap Hackathon Project", subtitle: "AI-driven recycling companion that classifies trash via camera uploads.", bgGradientStart: "#10b981", bgGradientEnd: "#059669", logoType: "auto", border: true } },
    { id: "hack-t", type: "techstack", props: { techs: "Python, PyTorch, React, Tailwind CSS", layout: "row", iconSize: 40, showLabel: true } }
  ],
  "portfolio": [
    { id: "port-h", type: "header", props: { style: "gradient", title: "Jane Dev - Software Engineer", subtitle: "Welcome to my portfolio! Building visual systems and high-throughput databases.", bgGradientStart: "#ec4899", bgGradientEnd: "#8b5cf6", logoType: "none", border: false } },
    { id: "port-stats", type: "githubstats", props: { username: "username", theme: "dark", statsType: "general", showIcons: true, hideRank: false } }
  ],
  "browser-ext": [
    { id: "ext-h", type: "header", props: { style: "solid", title: "FocusShield Extension", subtitle: "Chrome extension to block distracting feeds and set focus timers.", bgColor: "#4b5563", logoType: "auto", border: true } },
    { id: "ext-txt", type: "text", props: { content: "## Installation\nLoad unpacked folder inside chrome://extensions." } }
  ],
  "vscode-ext": [
    { id: "vsc-h", type: "header", props: { style: "minimal", title: "GitNotes VS Code Extension", subtitle: "Inline visual developer notes linked to git branches and git commits.", border: true } },
    { id: "vsc-txt", type: "text", props: { content: "## Install\nSearch for 'GitNotes' in the VS Code Marketplace." } }
  ],
  "discord-bot": [
    { id: "bot-h", type: "header", props: { style: "gradient", title: "ModeratorBot Discord", subtitle: "Auto-moderation bot keeping communities safe and rewarding contributions.", bgGradientStart: "#7289da", bgGradientEnd: "#23272a", logoType: "auto", border: true } },
    { id: "bot-t", type: "techstack", props: { techs: "Node.js, Discord.js, MongoDB", layout: "row", iconSize: 40, showLabel: true } }
  ],
  "youtube-channel": [
    { id: "yt-h", type: "header", props: { style: "gradient", title: "My YouTube Channel 🎥", subtitle: "Welcome! I create weekly videos about coding, design, and tech.", bgGradientStart: "#ff0000", bgGradientEnd: "#111111", logoType: "none", align: "center", border: false } },
    { id: "yt-v", type: "video", props: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", width: "70%", align: "center" } },
    { id: "yt-txt", type: "text", props: { content: "## Latest Videos\nCheck out my latest content above and don't forget to subscribe!" } },
    { id: "yt-s", type: "socials", props: { youtube: "https://youtube.com/@example", twitter: "https://twitter.com/example", align: "center" } }
  ],
  "hackathon-2": [
    {
      id: "hackathon-header",
      type: "header",
      props: {
        style: "minimal",
        title: "Hackathon Name 2025",
        subtitle: "One paragraph: what problem does this solve? Be specific. Who is affected?",
        logoType: "none",
        border: true
      }
    },
    {
      id: "hackathon-badges",
      type: "badges",
      props: {
        badgeList: ["license"],
        badgeStyle: "flat-square"
      }
    },
    {
      id: "hackathon-text-1",
      type: "text",
      props: {
        content: "## 💡 The Problem\n\n[One paragraph: what problem does this solve? Be specific. Who is affected?]\n\n## 🎯 Our Solution\n\n[One paragraph: what did you build? How does it solve the problem? What's the key insight?]"
      }
    },
    {
      id: "hackathon-video",
      type: "video",
      props: {
        url: "https://yourproject.vercel.app",
        align: "center",
        width: "100%"
      }
    },
    {
      id: "hackathon-text-2",
      type: "text",
      props: {
        content: "> [Live demo → yourproject.vercel.app](https://yourproject.vercel.app)\n\n## ✨ Features\n\n- [x] Feature 1 — core functionality\n- [x] Feature 2 — what makes it unique\n- [x] Feature 3 — key integration\n- [ ] Feature 4 — planned post-hackathon\n- [ ] Feature 5 — stretch goal"
      }
    },
    {
      id: "hackathon-tech",
      type: "techstack",
      props: {
        techs: "React, Node.js, TypeScript",
        layout: "row",
        iconSize: 40,
        showLabel: true
      }
    },
    {
      id: "hackathon-text-3",
      type: "text",
      props: {
        content: "## 🏃 Run Locally\n\n```bash\ngit clone https://github.com/your-username/your-repo\ncd your-repo\ncp .env.example .env.local\nnpm install\nnpm run dev\n```\n\n## 👥 Team\n\n| Name | Role | GitHub |\n|------|------|--------|\n| [Your Name] | Full Stack | [@yourhandle](https://github.com/yourhandle) |\n| [Teammate] | Design | [@teammate](https://github.com/teammate) |\n\n## 📄 License\n\nMIT — built at [Hackathon Name] 2025"
      }
    }
  ],
  "rest-api-2": [
    {
      id: "rest-header",
      type: "header",
      props: {
        style: "minimal",
        title: "your-api",
        subtitle: "REST API for [what it does]. Built with Node.js, TypeScript, and PostgreSQL.",
        border: true
      }
    },
    {
      id: "rest-badges",
      type: "badges",
      props: {
        badgeList: ["license"],
        badgeStyle: "flat-square"
      }
    },
    {
      id: "rest-text",
      type: "text",
      props: {
        content: "## Base URL\n\n```\nProduction:  https://api.yourdomain.com/v1\nStaging:     https://staging-api.yourdomain.com/v1\n```\n\n## Authentication\n\nAll endpoints require a Bearer token in the `Authorization` header:\n\n```bash\nAuthorization: Bearer <token>\n```\n\nGenerate an API key at [your dashboard](https://yourdomain.com/dashboard).\n\n## Endpoints\n\n### `GET /items`\n\nReturns a paginated list of items.\n\n```bash\ncurl https://api.yourdomain.com/v1/items \\\n  -H \"Authorization: Bearer YOUR_KEY\"\n```\n\n**Response**\n```json\n{\n  \"data\": [\n    { \"id\": \"item_123\", \"name\": \"Example\", \"created_at\": \"2025-01-01T00:00:00Z\" }\n  ],\n  \"pagination\": { \"page\": 1, \"per_page\": 20, \"total\": 142 }\n}\n```\n\n### `POST /items`\n\nCreate a new item.\n\n```bash\ncurl -X POST https://api.yourdomain.com/v1/items \\\n  -H \"Authorization: Bearer YOUR_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{ \"name\": \"New item\", \"type\": \"example\" }'\n```\n\n## Error Codes\n\n| Code | Meaning |\n|------|---------|\n| `400` | Bad request — invalid params |\n| `401` | Unauthorized — missing/invalid token |\n| `404` | Resource not found |\n| `429` | Rate limited — max 100 req/min |\n| `500` | Internal server error |\n\n## Rate Limits\n\n| Plan | Requests/min |\n|------|-------------|\n| Free | 20 |\n| Pro | 200 |\n| Enterprise | Unlimited |\n\n## Local Development\n\n```bash\ngit clone https://github.com/your-username/your-api\ncd your-api\ncp .env.example .env\ndocker compose up -d   # starts postgres + redis\nnpm install\nnpm run dev\n```\n\nAPI runs at `http://localhost:3001`\n\n## License\n\nMIT © [Your Name](https://github.com/your-username)"
      }
    }
  ],
  "npm-package-2": [
    {
      id: "npm-header",
      type: "header",
      props: {
        style: "minimal",
        title: "your-package",
        subtitle: "One-line description of what this package does.",
        border: true
      }
    },
    {
      id: "npm-badges",
      type: "badges",
      props: {
        packageName: "your-package",
        badgeList: ["npm-v", "license"],
        badgeStyle: "flat-square"
      }
    },
    {
      id: "npm-text",
      type: "text",
      props: {
        content: "## Install\n\n```bash\nnpm install your-package\n```\n\n## Usage\n\n```ts\nimport { yourFunction } from 'your-package'\n\nconst result = yourFunction({\n  input: 'value',\n  options: {},\n})\n\nconsole.log(result)\n// → { success: true, data: '...' }\n```\n\n## API\n\n### `yourFunction(options)`\n\n| Parameter | Type | Default | Description |\n|-----------|------|---------|-------------|\n| `input` | `string` | — | Required input value |\n| `timeout` | `number` | `5000` | Timeout in ms |\n| `debug` | `boolean` | `false` | Enable debug logs |\n\nReturns: `Promise`\n\n## Contributing\n\n```bash\ngit clone https://github.com/your-username/your-package\ncd your-package\nnpm install\nnpm test\n```\n\n## License\n\nMIT © [Your Name](https://github.com/your-username)"
      }
    }
  ],
  "modern-toolkit": [
    {
      id: "tk-header",
      type: "header",
      props: {
        style: "gradient",
        title: "Modern Toolkit",
        subtitle: "The modern toolkit for teams who ship. Built for speed, designed for scale.",
        bgGradientStart: "#0ea5e9",
        bgGradientEnd: "#10b981",
        border: true
      }
    },
    {
      id: "tk-badges",
      type: "badges",
      props: {
        packageName: "your-package",
        githubRepo: "your-username/your-repo",
        badgeList: ["npm-v", "github-stars", "license", "github-status"],
        badgeStyle: "flat-square"
      }
    },
    {
      id: "tk-text",
      type: "text",
      props: {
        content: "## ✦ Features\n\n| Feature | Description |\n|--------|-------------|\n| ⚡ Blazing fast | Optimized for performance from day one |\n| 🔒 Secure by default | End-to-end encryption, zero-trust architecture |\n| 🧩 Modular | Plug in only what you need |\n| 🌐 Global CDN | Sub-50ms response times worldwide |\n| 📊 Analytics built-in | Real-time dashboards, no extra setup |\n| 🤖 AI-powered | Intelligent suggestions, auto-complete, smart search |\n\n## 🚀 Getting Started\n\n### Installation\n\n```bash\nnpm install your-package\n```\n\n### Quick Setup\n\n```ts\nimport { createClient } from 'your-package'\n\nconst client = createClient({\n  apiKey: process.env.YOUR_API_KEY,\n  region: 'us-east-1',\n})\n\nconst result = await client.run({\n  input: 'Hello world',\n})\n\nconsole.log(result)\n```"
      }
    },
    {
      id: "tk-tech",
      type: "techstack",
      props: {
        techs: "TypeScript, React, Node.js, PostgreSQL",
        layout: "grid",
        iconSize: 40,
        showLabel: true
      }
    },
    {
      id: "tk-chart",
      type: "chart",
      props: {
        repo: "your-username/your-repo",
        theme: "dark"
      }
    },
    {
      id: "tk-text-2",
      type: "text",
      props: {
        content: "## 🤝 Contributing\n\nContributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.\n\n```bash\ngit clone https://github.com/your-username/your-repo.git\ncd your-repo\nnpm install\nnpm run dev\n```\n\n## 📄 License\n\nMIT © [Your Name](https://github.com/your-username)\n\n> If this helped you, consider giving it a ⭐"
      }
    }
  ],

  "ai-ml": [
    { id: "aiml-h", type: "header", props: { style: "gradient", title: "NeuralVision 🧠", subtitle: "State-of-the-art deep learning model for real-time image classification and segmentation.", bgGradientStart: "#7c3aed", bgGradientEnd: "#db2777", logoType: "auto", align: "center", border: true, titleSize: "xl", textShadow: true } },
    { id: "aiml-badges", type: "badges", props: { packageName: "torch", githubRepo: "pytorch/pytorch", badgeList: ["github-stars", "license"], badgeStyle: "for-the-badge", align: "center", badgeColor: "7c3aed" } },
    { id: "aiml-tech", type: "techstack", props: { techs: "Python, PyTorch, TensorFlow, NumPy, Pandas, Jupyter, Docker", layout: "row", iconSize: 44, showLabel: true } },
    { id: "aiml-txt", type: "text", props: { content: "## ✨ Highlights\n\n- **98.6%** top-1 accuracy on ImageNet\n- Real-time inference at **60 FPS** on a single GPU\n- Pretrained weights + ONNX export included\n\n## 🚀 Quickstart\n\n```bash\npip install neuralvision\n```\n\n```python\nfrom neuralvision import Model\n\nmodel = Model.from_pretrained(\"base\")\npreds = model.predict(\"image.jpg\")\n```" } },
    { id: "aiml-table", type: "table", props: { headers: ["Model", "Params", "Accuracy", "Latency"], rows: [["`nv-small`", "12M", "94.1%", "8ms"], ["`nv-base`", "48M", "97.3%", "16ms"], ["`nv-large`", "121M", "98.6%", "34ms"]] } },
    { id: "aiml-div", type: "divider", props: { style: "line", color: "#7c3aed" } },
    { id: "aiml-txt2", type: "text", props: { content: "## 📄 Citation\n\n```bibtex\n@article{neuralvision2025,\n  title={NeuralVision: Efficient Real-Time Vision},\n  year={2025}\n}\n```\n\nMIT License · Built with ❤️ for the ML community" } }
  ],

  "open-source": [
    { id: "os-h", type: "header", props: { style: "gradient", title: "Your Project Name", subtitle: "A short, punchy one-liner describing what your library does and why people should care.", bgGradientStart: "#2563eb", bgGradientEnd: "#7c3aed", logoType: "auto", align: "center", border: true, titleSize: "xl" } },
    { id: "os-badges", type: "badges", props: { packageName: "react", githubRepo: "facebook/react", badgeList: ["npm-v", "github-stars", "license"], badgeStyle: "flat", align: "center" } },
    { id: "os-socials", type: "socials", props: { layout: "row", badgeStyle: "for-the-badge", align: "center", logoOnly: false, items: [ { platform: "GitHub", url: "https://github.com/you", label: "Star" }, { platform: "Twitter/X", url: "https://twitter.com/you", label: "Follow" }, { platform: "Discord", url: "https://discord.gg/you", label: "Join" } ] } },
    { id: "os-txt", type: "text", props: { content: "## 📖 Table of Contents\n\n- [Features](#features)\n- [Installation](#installation)\n- [Usage](#usage)\n- [Contributing](#contributing)\n\n## ✨ Features\n\n- 🚀 Fast and lightweight — zero dependencies\n- 🔒 Fully typed with TypeScript\n- 🧩 Modular and tree-shakeable\n- 📱 Works everywhere — Node, Deno, browser\n\n## 📦 Installation\n\n```bash\nnpm install your-project\n```\n\n## 🔨 Usage\n\n```ts\nimport { doThing } from \"your-project\";\n\nawait doThing({ fast: true });\n```" } },
    { id: "os-contrib", type: "contributors", props: { repo: "facebook/react", maxCount: 12, avatarSize: 48 } },
    { id: "os-chart", type: "chart", props: { username: "facebook", chartType: "repos-per-language", theme: "github_dark" } },
    { id: "os-txt2", type: "text", props: { content: "## 🤝 Contributing\n\nPRs welcome! Read the [contributing guide](./CONTRIBUTING.md) to get started.\n\n## 📄 License\n\nMIT © Your Name" } }
  ],

  "python-lib": [
    { id: "py-h", type: "header", props: { style: "solid", title: "pandas-helper", subtitle: "Handy utilities that make everyday DataFrame wrangling a breeze.", bgColor: "#0d1117", logoType: "auto", align: "center", border: true, font: "mono" } },
    { id: "py-badges", type: "badges", props: { packageName: "pandas", githubRepo: "pandas-dev/pandas", badgeList: ["github-stars", "license"], badgeStyle: "flat-square", align: "center" } },
    { id: "py-tech", type: "techstack", props: { techs: "Python, Pandas, NumPy", layout: "row", iconSize: 40, showLabel: true } },
    { id: "py-txt", type: "text", props: { content: "## 📦 Installation\n\n```bash\npip install pandas-helper\n```\n\n## 🚀 Usage\n\n```python\nimport pandas as pd\nfrom pandas_helper import clean\n\ndf = pd.read_csv(\"data.csv\")\ndf = clean(df)  # drop nulls, fix dtypes, trim strings\n```\n\n## 🧪 Development\n\n```bash\ngit clone https://github.com/you/pandas-helper\ncd pandas-helper\npip install -e \".[dev]\"\npytest\n```" } },
    { id: "py-table", type: "table", props: { headers: ["Function", "Description"], rows: [["`clean(df)`", "One-shot DataFrame cleaning"], ["`profile(df)`", "Quick summary statistics"], ["`to_snake(df)`", "snake_case all column names"]] } }
  ],

  "game-dev": [
    { id: "gd-h", type: "header", props: { style: "image", title: "Starfall Odyssey", subtitle: "An open-world space exploration game built in Unity.", bgType: "image", bgImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80", logoType: "none", align: "center", border: true, titleSize: "xl", overlay: 55, textShadow: true } },
    { id: "gd-badges", type: "badges", props: { githubRepo: "godotengine/godot", badgeList: ["github-stars", "license"], badgeStyle: "for-the-badge", align: "center" } },
    { id: "gd-txt", type: "text", props: { content: "## 🎮 About\n\nExplore a procedurally generated galaxy, trade with alien factions, and uncover the mystery of the Starfall.\n\n## 🕹️ Controls\n\n| Key | Action |\n| --- | --- |\n| `W A S D` | Move |\n| `Space` | Boost |\n| `E` | Interact |\n\n## 🛠️ Build From Source\n\n1. Open the project in **Unity 2022.3 LTS**\n2. Load `Scenes/Main.unity`\n3. Press **Play** ▶️" } },
    { id: "gd-vid", type: "video", props: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "Gameplay Trailer", width: 80, align: "center" } }
  ],

  "docs-site": [
    { id: "ds-h", type: "header", props: { style: "gradient", title: "Project Docs", subtitle: "Everything you need to install, configure, and master the toolkit.", bgGradientStart: "#0ea5e9", bgGradientEnd: "#6366f1", logoType: "auto", align: "center", border: true } },
    { id: "ds-txt", type: "text", props: { content: "## 📚 Documentation\n\n> **Tip:** Use the sidebar to navigate between sections.\n\n### Getting Started\n\n```bash\nnpm create your-app@latest\n```\n\n### Configuration\n\nCreate a `config.json` in your project root:\n\n```json\n{\n  \"theme\": \"dark\",\n  \"plugins\": [\"search\", \"analytics\"]\n}\n```" } },
    { id: "ds-table", type: "table", props: { headers: ["Option", "Type", "Default", "Description"], rows: [["`theme`", "string", "`\"light\"`", "UI color theme"], ["`baseUrl`", "string", "`\"/\"`", "Deployment base path"], ["`search`", "boolean", "`true`", "Enable full-text search"]] } },
    { id: "ds-roadmap", type: "roadmap", props: { items: [ { text: "Getting Started guide", done: true }, { text: "API reference", done: true }, { text: "Migration guide", done: false }, { text: "Video tutorials", done: false } ] } }
  ],

  "awesome-list": [
    { id: "aw-h", type: "header", props: { style: "gradient", title: "Awesome Topic", subtitle: "A curated list of awesome frameworks, libraries, and resources.", bgGradientStart: "#f59e0b", bgGradientEnd: "#ef4444", logoType: "none", align: "center", border: true, titleSize: "xl" } },
    { id: "aw-badges", type: "badges", props: { githubRepo: "sindresorhus/awesome", badgeList: ["github-stars"], badgeStyle: "for-the-badge", align: "center" } },
    { id: "aw-txt", type: "text", props: { content: "## Contents\n\n- [Libraries](#libraries)\n- [Tools](#tools)\n- [Resources](#resources)\n\n## 📚 Libraries\n\n- **[Library A](https://github.com)** — Short description of what it does.\n- **[Library B](https://github.com)** — Short description of what it does.\n- **[Library C](https://github.com)** — Short description of what it does.\n\n## 🛠️ Tools\n\n- **[Tool A](https://github.com)** — Short description.\n- **[Tool B](https://github.com)** — Short description.\n\n## 📖 Resources\n\n- **[Guide](https://github.com)** — Comprehensive tutorial.\n- **[Video](https://youtube.com)** — Deep-dive walkthrough." } },
    { id: "aw-txt2", type: "text", props: { content: "## 🤝 Contributing\n\nContributions welcome! Please read the [contribution guidelines](./CONTRIBUTING.md) first." } }
  ]
};

const INITIAL_BLOCKS: Block[] = [
  {
    id: "header-3",
    type: "header",
    props: {
      style: "minimal",
      title: "⚡ FAST-CLI",
      subtitle: "A super-fast developer terminal tool that automates environment setup, git hooks, and docker configs in under 2 seconds.",
      logoType: "none",
      theme: "dark",
      align: "center",
      font: "mono",
      border: true,
      watermark: false,
    },
  },
  {
    id: "text-3",
    type: "text",
    props: {
      content: `## 🚀 Quick Start

\`\`\`bash
npx fast-cli-tool create --template fullstack
\`\`\`

## 📊 Star History

Thank you to all contributors who have starred the repository!
`,
    },
  },
  {
    id: "chart-1",
    type: "chart",
    props: {
      repo: "shadcn/ui",
      theme: "dark",
    },
  },
];

export const useReadmeStore = create<ReadmeState>((set, get) => {
  const saveStateToHistory = (newBlocks: Block[]) => {
    set((state) => ({
      history: [...state.history, state.blocks],
      future: [],
      blocks: newBlocks,
    }));
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("readme-studio-blocks", JSON.stringify(newBlocks));
    }
  };

  return {
    blocks: INITIAL_BLOCKS,
    selectedBlockId: "header-3",
    selectedBlockIds: ["header-3"], // default selection includes active
    copiedBlocks: [],
    history: [],
    future: [],
    projectName: "Untitled README",
    activeProjectId: null,
    projects: [],

    initFromStorage: () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("readme-studio-blocks");
        const storedProjectName = localStorage.getItem("readme-studio-project-name");
        if (storedProjectName) {
          set({ projectName: storedProjectName });
        }
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Block[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              set({
                blocks: parsed,
                selectedBlockId: parsed[0]?.id || null,
                selectedBlockIds: parsed[0] ? [parsed[0].id] : [],
                history: [],
                future: [],
              });
            }
          } catch (e) {
            console.error("Error parsing stored blocks:", e);
          }
        }
      }
    },

    setBlocks: (newBlocks) => {
      saveStateToHistory(newBlocks);
    },

    addBlock: (type, parentId) => {
      const id = `${type}-${Date.now()}`;
      const newBlock: Block = {
        id,
        type,
        props: JSON.parse(JSON.stringify(DEFAULT_BLOCK_PROPS[type] || {})),
        parentId,
      };

      const newBlocks = [...get().blocks, newBlock];
      saveStateToHistory(newBlocks);
      set({ selectedBlockId: id, selectedBlockIds: [id] });
    },

    removeBlock: (id) => {
      const blocks = get().blocks;
      const newBlocks = blocks.filter((b) => b.id !== id && b.parentId !== id);
      saveStateToHistory(newBlocks);
      if (get().selectedBlockId === id) {
        set({ selectedBlockId: newBlocks[0]?.id || null, selectedBlockIds: newBlocks[0] ? [newBlocks[0].id] : [] });
      }
    },

    duplicateBlock: (id) => {
      const blocks = get().blocks;
      const targetIndex = blocks.findIndex((b) => b.id === id);
      if (targetIndex === -1) return;

      const target = blocks[targetIndex];
      const newId = `${target.type}-${Date.now()}`;
      const duplicate: Block = {
        id: newId,
        type: target.type,
        props: JSON.parse(JSON.stringify(target.props)),
        parentId: target.parentId,
        _note: target._note
      };

      const newBlocks = [...blocks];
      newBlocks.splice(targetIndex + 1, 0, duplicate);

      // If duplicating a group, duplicate its children too
      if (target.type === "group") {
        const children = blocks.filter((b) => b.parentId === id);
        children.forEach((child, childIdx) => {
          const newChildId = `${child.type}-${Date.now()}-${childIdx}`;
          const childDuplicate: Block = {
            id: newChildId,
            type: child.type,
            props: JSON.parse(JSON.stringify(child.props)),
            parentId: newId,
            _note: child._note
          };
          newBlocks.splice(targetIndex + 2 + childIdx, 0, childDuplicate);
        });
      }

      saveStateToHistory(newBlocks);
      set({ selectedBlockId: newId, selectedBlockIds: [newId] });
    },

    updateBlock: (id, props) => {
      const newBlocks = get().blocks.map((b) => {
        if (b.id === id) {
          return { ...b, props: { ...b.props, ...props } };
        }
        return b;
      });
      set({ blocks: newBlocks });
      if (typeof window !== "undefined") {
        localStorage.setItem("readme-studio-blocks", JSON.stringify(newBlocks));
      }
    },

    updateBlockNote: (id, note) => {
      const newBlocks = get().blocks.map((b) => {
        if (b.id === id) {
          return { ...b, _note: note };
        }
        return b;
      });
      saveStateToHistory(newBlocks);
    },

    reorderBlocks: (fromIndex, toIndex, parentId) => {
      const blocks = get().blocks;
      const targetBlocks = blocks.filter((b) => b.parentId === parentId);
      const fromBlock = targetBlocks[fromIndex];
      const toBlock = targetBlocks[toIndex];

      if (!fromBlock || !toBlock) return;

      const absFrom = blocks.findIndex((b) => b.id === fromBlock.id);
      const absTo = blocks.findIndex((b) => b.id === toBlock.id);

      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(absFrom, 1);
      newBlocks.splice(absTo, 0, removed);

      saveStateToHistory(newBlocks);
    },

    selectBlock: (id) => {
      set({
        selectedBlockId: id,
        selectedBlockIds: id ? [id] : []
      });
    },

    // Multi-select actions
    toggleMultiSelectBlock: (id) => {
      const currentIds = get().selectedBlockIds;
      let newIds = [...currentIds];
      if (currentIds.includes(id)) {
        newIds = newIds.filter(x => x !== id);
      } else {
        newIds.push(id);
      }
      set({
        selectedBlockIds: newIds,
        selectedBlockId: newIds.length > 0 ? newIds[newIds.length - 1] : null
      });
    },

    clearMultiSelect: () => {
      set({ selectedBlockIds: [], selectedBlockId: null });
    },

    copySelectedBlocks: () => {
      const { blocks, selectedBlockIds, selectedBlockId } = get();
      const ids = selectedBlockIds.length > 0
        ? selectedBlockIds
        : selectedBlockId
          ? [selectedBlockId]
          : [];

      if (ids.length === 0) return;
      const copied = blocks.filter(b => ids.includes(b.id)).map(b => JSON.parse(JSON.stringify(b)));
      set({ copiedBlocks: copied });
    },

    pasteBlocks: () => {
      const { blocks, copiedBlocks, selectedBlockId } = get();
      if (copiedBlocks.length === 0) return;

      const newBlocks = [...blocks];
      const targetId = selectedBlockId || (blocks.length > 0 ? blocks[blocks.length - 1].id : null);
      const targetIdx = targetId ? blocks.findIndex(b => b.id === targetId) : -1;

      const pastedList: Block[] = [];
      const idMap: Record<string, string> = {};

      copiedBlocks.forEach((b) => {
        const newId = `${b.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        idMap[b.id] = newId;
        pastedList.push({
          ...b,
          id: newId,
          props: JSON.parse(JSON.stringify(b.props)),
          _note: b._note
        });
      });

      pastedList.forEach((b) => {
        if (b.parentId && idMap[b.parentId]) {
          b.parentId = idMap[b.parentId];
        }
      });

      if (targetIdx !== -1) {
        newBlocks.splice(targetIdx + 1, 0, ...pastedList);
      } else {
        newBlocks.push(...pastedList);
      }

      saveStateToHistory(newBlocks);
      set({
        selectedBlockId: pastedList[0].id,
        selectedBlockIds: pastedList.map(b => b.id)
      });
    },

    groupSelectedBlocks: () => {
      const { blocks, selectedBlockIds } = get();
      if (selectedBlockIds.length === 0) return;

      const groupId = `group-${Date.now()}`;
      const groupBlock: Block = {
        id: groupId,
        type: "group",
        props: { title: "Group Container" }
      };

      const newBlocks = blocks.map(b => {
        if (selectedBlockIds.includes(b.id)) {
          return { ...b, parentId: groupId };
        }
        return b;
      });

      const firstIdx = blocks.findIndex(b => selectedBlockIds.includes(b.id));
      const targetIdx = firstIdx !== -1 ? firstIdx : newBlocks.length;
      newBlocks.splice(targetIdx, 0, groupBlock);

      saveStateToHistory(newBlocks);
      set({ selectedBlockId: groupId, selectedBlockIds: [groupId] });
    },

    deleteSelectedBlocks: () => {
      const { blocks, selectedBlockIds } = get();
      if (selectedBlockIds.length === 0) return;

      const newBlocks = blocks.filter(b => !selectedBlockIds.includes(b.id) && (!b.parentId || !selectedBlockIds.includes(b.parentId)));
      saveStateToHistory(newBlocks);
      set({ selectedBlockId: null, selectedBlockIds: [] });
    },

    moveSelectedBlocks: (direction) => {
      const { blocks, selectedBlockIds } = get();
      if (selectedBlockIds.length === 0) return;

      const newBlocks = [...blocks];
      const sortedSelectedIds = [...selectedBlockIds].sort((a, b) => {
        return blocks.findIndex(x => x.id === a) - blocks.findIndex(x => x.id === b);
      });

      if (direction === "up") {
        for (const id of sortedSelectedIds) {
          const idx = newBlocks.findIndex(x => x.id === id);
          if (idx > 0) {
            const temp = newBlocks[idx];
            newBlocks[idx] = newBlocks[idx - 1];
            newBlocks[idx - 1] = temp;
          }
        }
      } else {
        for (let i = sortedSelectedIds.length - 1; i >= 0; i--) {
          const id = sortedSelectedIds[i];
          const idx = newBlocks.findIndex(x => x.id === id);
          if (idx !== -1 && idx < newBlocks.length - 1) {
            const temp = newBlocks[idx];
            newBlocks[idx] = newBlocks[idx + 1];
            newBlocks[idx + 1] = temp;
          }
        }
      }

      saveStateToHistory(newBlocks);
    },

    duplicateSelectedBlocks: () => {
      const { blocks, selectedBlockIds } = get();
      if (selectedBlockIds.length === 0) return;

      const newBlocks = [...blocks];
      const duplicatedIds: string[] = [];

      selectedBlockIds.forEach((id) => {
        const idx = newBlocks.findIndex((b) => b.id === id);
        if (idx === -1) return;
        const target = newBlocks[idx];
        const newId = `${target.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const duplicate: Block = {
          id: newId,
          type: target.type,
          props: JSON.parse(JSON.stringify(target.props)),
          parentId: target.parentId,
          _note: target._note
        };
        newBlocks.splice(idx + 1, 0, duplicate);
        duplicatedIds.push(newId);
      });

      saveStateToHistory(newBlocks);
      set({ selectedBlockIds: duplicatedIds, selectedBlockId: duplicatedIds[0] });
    },

    setProjectName: (name) => {
      set({ projectName: name });
      if (typeof window !== "undefined") {
        localStorage.setItem("readme-studio-project-name", name);
      }
    },

    setActiveProjectId: (id) => {
      set({ activeProjectId: id });
    },

    setProjects: (projects) => {
      set({ projects });
    },

    loadProject: (id) => {
      const proj = get().projects.find(p => p.id === id);
      if (proj) {
        set({
          blocks: proj.blocks,
          projectName: proj.name,
          activeProjectId: proj.id,
          selectedBlockId: proj.blocks[0]?.id || null,
          selectedBlockIds: proj.blocks[0] ? [proj.blocks[0].id] : [],
          history: [],
          future: []
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("readme-studio-blocks", JSON.stringify(proj.blocks));
          localStorage.setItem("readme-studio-project-name", proj.name);
        }
      }
    },

    resetStore: () => {
      saveStateToHistory(INITIAL_BLOCKS);
      set({
        selectedBlockId: INITIAL_BLOCKS[0].id,
        selectedBlockIds: [INITIAL_BLOCKS[0].id],
        projectName: "Untitled README",
        activeProjectId: null
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("readme-studio-project-name", "Untitled README");
      }
    },

    undo: () => {
      const history = get().history;
      if (history.length === 0) return;

      const previous = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);

      set((state) => ({
        future: [state.blocks, ...state.future],
        history: newHistory,
        blocks: previous,
        selectedBlockId: previous[0]?.id || null,
        selectedBlockIds: previous[0] ? [previous[0].id] : [],
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem("readme-studio-blocks", JSON.stringify(previous));
      }
    },

    redo: () => {
      const future = get().future;
      if (future.length === 0) return;

      const next = future[0];
      const newFuture = future.slice(1);

      set((state) => ({
        history: [...state.history, state.blocks],
        future: newFuture,
        blocks: next,
        selectedBlockId: next[0]?.id || null,
        selectedBlockIds: next[0] ? [next[0].id] : [],
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem("readme-studio-blocks", JSON.stringify(next));
      }
    },

    canUndo: () => get().history.length > 0,
    canRedo: () => get().future.length > 0,

    loadTemplate: (template) => {
      const templateData = TEMPLATE_BLOCKS[template];
      if (!templateData) return;

      const cloned = JSON.parse(JSON.stringify(templateData));
      saveStateToHistory(cloned);
      set({ selectedBlockId: cloned[0]?.id || null, selectedBlockIds: cloned[0] ? [cloned[0].id] : [] });
    },
  };
});
