// Shared tech-name → devicon slug resolver used by the Tech Stack block.
// Devicon icons live at:
//   https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<slug>/<slug>-<variant>.svg

// Common display names / aliases → devicon slug
const TECH_SLUG_MAP: Record<string, string> = {
  // Frameworks / libraries
  react: "react", reactjs: "react", "react.js": "react",
  next: "nextjs", nextjs: "nextjs", "next.js": "nextjs",
  vue: "vuejs", vuejs: "vuejs", "vue.js": "vuejs",
  nuxt: "nuxtjs", nuxtjs: "nuxtjs",
  angular: "angularjs", angularjs: "angularjs",
  svelte: "svelte", solid: "solidjs", solidjs: "solidjs",
  remix: "react", astro: "astro", gatsby: "gatsby",
  redux: "redux", jquery: "jquery", threejs: "threejs", "three.js": "threejs", d3: "d3js",
  // Runtimes / languages
  node: "nodejs", nodejs: "nodejs", "node.js": "nodejs",
  deno: "denojs", bun: "bun",
  typescript: "typescript", ts: "typescript",
  javascript: "javascript", js: "javascript",
  python: "python", py: "python",
  java: "java", kotlin: "kotlin", swift: "swift", scala: "scala",
  go: "go", golang: "go", rust: "rust",
  c: "c", "c++": "cplusplus", cpp: "cplusplus",
  "c#": "csharp", csharp: "csharp", "cs": "csharp",
  ".net": "dotnetcore", dotnet: "dotnetcore", dotnetcore: "dotnetcore",
  php: "php", ruby: "ruby", rails: "rails", elixir: "elixir", dart: "dart",
  r: "r", perl: "perl", lua: "lua", haskell: "haskell", clojure: "clojure",
  // Markup / styling
  html: "html5", html5: "html5",
  css: "css3", css3: "css3",
  sass: "sass", scss: "sass", less: "less",
  tailwind: "tailwindcss", tailwindcss: "tailwindcss",
  bootstrap: "bootstrap", materialui: "materialui", mui: "materialui", chakra: "chakraui",
  styledcomponents: "styledcomponents",
  // Backend frameworks
  express: "express", expressjs: "express",
  nestjs: "nestjs", nest: "nestjs",
  fastapi: "fastapi", django: "django", flask: "flask",
  spring: "spring", springboot: "spring", laravel: "laravel", symfony: "symfony",
  dotnetframework: "dotnetcore", graphql: "graphql", socketio: "socketio",
  // Databases
  postgres: "postgresql", postgresql: "postgresql",
  mysql: "mysql", mariadb: "mariadb",
  mongodb: "mongodb", mongo: "mongodb",
  redis: "redis", sqlite: "sqlite",
  firebase: "firebase", supabase: "supabase", prisma: "prisma",
  sql: "mysql", cassandra: "cassandra", elasticsearch: "elasticsearch",
  // DevOps / cloud / tools
  docker: "docker", kubernetes: "kubernetes", k8s: "kubernetes",
  aws: "amazonwebservices", amazonaws: "amazonwebservices", "amazon web services": "amazonwebservices",
  gcp: "googlecloud", googlecloud: "googlecloud", "google cloud": "googlecloud",
  azure: "azure", digitalocean: "digitalocean", heroku: "heroku",
  vercel: "vercel", netlify: "netlify", nginx: "nginx", apache: "apache",
  terraform: "terraform", ansible: "ansible", jenkins: "jenkins",
  git: "git", github: "github", gitlab: "gitlab", bitbucket: "bitbucket",
  linux: "linux", ubuntu: "ubuntu", debian: "debian", bash: "bash",
  // Build / test
  vite: "vitejs", webpack: "webpack", babel: "babel", rollup: "rollup",
  jest: "jest", mocha: "mocha", cypress: "cypressio", vitest: "vitest",
  storybook: "storybook", eslint: "eslint", prettier: "prettier",
  // Data / ML
  tensorflow: "tensorflow", pytorch: "pytorch", pandas: "pandas",
  numpy: "numpy", scikitlearn: "scikitlearn", jupyter: "jupyter", opencv: "opencv",
  // Mobile / desktop
  flutter: "flutter", androidstudio: "androidstudio", electron: "electron",
  reactnative: "react", xcode: "xcode",
  // Design
  figma: "figma", photoshop: "photoshop", illustrator: "illustrator",
  xd: "xd", blender: "blender", sketch: "sketch",
};

// Devicon icons that only ship a "-plain" variant (no "-original")
const PLAIN_ONLY = new Set([
  "styledcomponents",
]);

// Devicon icons whose only usable file is a non-standard variant filename
const VARIANT_OVERRIDE: Record<string, string> = {
  amazonwebservices: "original-wordmark",
};

// Resolve a user-typed tech name to a devicon slug, or null if unknown. 
export function techToSlug(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (TECH_SLUG_MAP[key]) return TECH_SLUG_MAP[key];
  // Fallback: strip anything that isn't a-z0-9 and try that as a slug
  const normalized = key.replace(/[^a-z0-9+#.]/g, "").replace(/\./g, "").replace(/\+/g, "plus").replace(/#/g, "sharp");
  return normalized ? normalized : null;
}

// Whether we have an explicit mapping for this name
export function isKnownTech(name: string): boolean {
  return !!TECH_SLUG_MAP[name.trim().toLowerCase()];
}

// Build the devicon CDN URL for a slug + variant
export function deviconUrl(slug: string, variant: "original" | "plain" = "original"): string {
  const v = VARIANT_OVERRIDE[slug] ?? (PLAIN_ONLY.has(slug) ? "plain" : variant);
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${v}.svg`;
}
