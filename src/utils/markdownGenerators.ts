import { Block } from "@/store/blockRegistry";
import { techToSlug, isKnownTech, deviconUrl } from "@/utils/techIcons";
import { socialBadgeUrl } from "@/utils/socialPlatforms";
import { APP_URL } from "@/lib/site";

export function blockToMarkdown(block: Block, allBlocks: Block[]): string {
  const { type, props } = block;

  switch (type) {
    case "header": {
      const align = props.align || "center";
      const alignHtml = align === "center" ? ' align="center"' : align === "right" ? ' align="right"' : "";
      const font = props.font || "inter";
      
      let content = "";

      if (props.bgType === "image" && props.bgImage) {
        content += `<p${alignHtml}><img src="${props.bgImage}" alt="${props.altText || "banner"}" width="100%" /></p>\n\n`;
      }

      const hasLogo = props.logoType !== "none";
      const logoUrl = props.logoType === "auto" 
        ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80" 
        : props.logoUrl;

      if (align === "center" || align === "right") {
        content += `<div${alignHtml}>\n`;
        if (hasLogo && logoUrl) {
          content += `  <img src="${logoUrl}" alt="${props.altText || "logo"}" height="80" style="border-radius: 12px; margin-bottom: 10px;" />\n`;
        }
        content += `  <h1>${props.title || ""}</h1>\n`;
        if (props.subtitle) {
          content += `  <p><em>${props.subtitle}</em></p>\n`;
        }
        content += `</div>\n`;
      } else {
        if (hasLogo && logoUrl) {
          content += `<img src="${logoUrl}" alt="${props.altText || "logo"}" height="60" style="border-radius: 8px; float: left; margin-right: 15px; margin-bottom: 10px;" />\n\n`;
        }
        content += `# ${props.title || ""}\n\n`;
        if (props.subtitle) {
          content += `> ${props.subtitle}\n\n`;
        }
        if (hasLogo && logoUrl) {
          content += `<br clear="left"/>\n\n`;
        }
      }

      if (props.border) {
        content += "\n---\n";
      }

      if (props.watermark) {
        content += `\n<p align="right"><sub><em>Generated with <a href="${APP_URL}">Readmefy</a></em></sub></p>\n`;
      }

      return content;
    }

    case "text": {
      return props.content || "";
    }

    case "badges": {
      const { packageName, githubRepo, badgeList = [], badgeStyle = "flat", align = "left", gap = "normal", badgeColor = "" } = props;
      const badges: string[] = [];
      const colorParam = badgeColor ? `&color=${badgeColor.replace("#", "")}` : "";

      badgeList.forEach((badgeType: string) => {
        if (badgeType === "npm-v" && packageName) {
          badges.push(
            `[![npm version](https://img.shields.io/npm/v/${packageName}.svg?style=${badgeStyle}${colorParam})](https://www.npmjs.com/package/${packageName})`
          );
        } else if (badgeType === "github-stars" && githubRepo) {
          badges.push(
            `[![github stars](https://img.shields.io/github/stars/${githubRepo}.svg?style=${badgeStyle}${colorParam})](https://github.com/${githubRepo}/stargazers)`
          );
        } else if (badgeType === "license" && githubRepo) {
          badges.push(
            `[![license](https://img.shields.io/github/license/${githubRepo}.svg?style=${badgeStyle}${colorParam})](https://github.com/${githubRepo}/blob/main/LICENSE)`
          );
        } else if (badgeType === "github-status" && githubRepo) {
          badges.push(
            `[![build status](https://img.shields.io/github/actions/workflow/status/${githubRepo}/ci.yml.svg?style=${badgeStyle}&label=build${colorParam})](https://github.com/${githubRepo}/actions)`
          );
        }
      });

      const separator = gap === "tight" ? "" : gap === "wide" ? " &nbsp; " : " ";
      const row = badges.join(separator);

      if (align === "center" || align === "right") {
        return `<div align="${align}">\n\n${row}\n\n</div>`;
      }
      return row;
    }

    case "group": {
      const children = allBlocks.filter((b) => b.parentId === block.id);
      if (children.length === 0) return "";
      
      const childrenMarkdown = children
        .map((c) => blockToMarkdown(c, allBlocks))
        .join("\n\n");

      return `<blockquote>\n\n### ${props.title || "Section"}\n\n${childrenMarkdown}\n\n</blockquote>`;
    }

    case "chart": {
      const username = (props.username || "torvalds").replace(/\s/g, "");
      const chartType = props.chartType || "repos-per-language";
      const theme = props.theme || "github_dark";
      const src = `https://github-profile-summary-cards.vercel.app/api/cards/${chartType}?username=${username}&theme=${theme}`;
      return `[![${chartType}](${src})](https://github.com/${username})`;
    }

    case "table": {
      const headers = props.headers || [];
      const rows = props.rows || [];

      if (headers.length === 0) return "";

      const headerRow = `| ${headers.join(" | ")} |`;
      const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
      const bodyRows = rows.map((row: string[]) => `| ${row.join(" | ")} |`);

      return [headerRow, dividerRow, ...bodyRows].join("\n");
    }

    case "image": {
      const url = props.url || "";
      const caption = props.caption || "";
      const align = props.align || "center";
      const width = props.width || "100%";

      const alignHtml = align === "center" ? ' align="center"' : align === "right" ? ' align="right"' : "";

      let content = `<p${alignHtml}>\n  <img src="${url}" alt="${caption || "Image"}" width="${width}" />\n</p>`;
      if (caption) {
        content += `\n<p${alignHtml}><em>${caption}</em></p>`;
      }

      return content;
    }

    case "sponsors": {
      const sponsors = props.sponsors || [];
      const layout = props.layout || "grid";
      const title = props.title || "";
      const align = props.align || "center";
      const size = Number(props.logoSize) || 64;
      const showNames = props.showNames ?? true;
      const radius = props.logoShape === "square" ? "0" : props.logoShape === "rounded" ? "12px" : "50%";

      if (sponsors.length === 0) return "";

      const heading = title ? `### ${title}\n\n` : "";

      if (layout === "grid") {
        let content = `${heading}<p align="${align}">\n`;
        sponsors.forEach((sp: any) => {
          const nameLabel = showNames ? `<br/><sub>${sp.name}</sub>` : "";
          content += `  <a href="${sp.link || "https://github.com"}"><img src="${sp.logo}" width="${size}" height="${size}" alt="${sp.name}" style="border-radius: ${radius}; margin: 6px;" />${nameLabel}</a>\n`;
        });
        content += `</p>`;
        return content;
      } else {
        return heading + sponsors
          .map((sp: any) => `- **[${sp.name}](${sp.link || "https://github.com"})**`)
          .join("\n");
      }
    }

    case "techstack": {
      const { techs = "", layout = "row", iconSize = 40, showLabel = true } = props;
      const techNames = techs.split(",").map((t: string) => t.trim()).filter(Boolean);
      
      if (techNames.length === 0) return "";

      // Known techs → square devicon icon; unknown techs → shields badge (never a broken image)
      const getIcon = (name: string) => {
        if (isKnownTech(name)) {
          const slug = techToSlug(name)!;
          // Square devicon: set BOTH width & height so it can't balloon to full width.
          return { url: deviconUrl(slug), dims: `width="${iconSize}" height="${iconSize}"` };
        }
        const label = encodeURIComponent(name.trim());
        // Shields badge has its own aspect ratio → only constrain height.
        return { url: `https://img.shields.io/badge/${label}-4B5563?style=flat`, dims: `height="${iconSize}"` };
      };

      if (layout === "grid") {
        let md = `<table align="center">\n  <tr>\n`;
        techNames.forEach((tech: string, i: number) => {
          const { url, dims } = getIcon(tech);
          md += `    <td align="center" valign="top" width="${iconSize + 20}">\n`;
          md += `      <img src="${url}" alt="${tech}" ${dims} />\n`;
          if (showLabel && isKnownTech(tech)) {
            md += `      <br/><sub>${tech}</sub>\n`;
          }
          md += `    </td>\n`;
          // Split into rows of 6
          if ((i + 1) % 6 === 0 && i !== techNames.length - 1) {
            md += `  </tr>\n  <tr>\n`;
          }
        });
        md += `  </tr>\n</table>`;
        return md;
      } else {
        let md = `<p align="center">\n`;
        techNames.forEach((tech: string, i: number) => {
          const { url, dims } = getIcon(tech);
          md += `  <img src="${url}" alt="${tech}" ${dims} />\n`;
          if (i < techNames.length - 1) {
            md += `  &nbsp;&nbsp;\n`;
          }
        });
        md += `</p>`;
        return md;
      }
    }

    case "contributors": {
      const { repo = "vercel/next.js", maxCount = 12 } = props;
      if (!repo) return "";
      return `<p align="center">\n  <a href="https://github.com/${repo}/graphs/contributors">\n    <img src="https://contrib.rocks/image?repo=${repo}&max=${maxCount}" alt="Contributors" />\n  </a>\n</p>`;
    }

    case "socials": {
      const { items = [], layout = "row", badgeStyle = "for-the-badge", align = "center", logoOnly = false } = props;
      if (items.length === 0) return "";

      // Inline <a><img/></a> inside a single <p align> keeps badges on one line (horizontal),
      // matching how they render on the design canvas. Column layout inserts <br/> to stack them.
      const anchors = items.map((item: any) => {
        const badgeUrl = socialBadgeUrl(item.platform, item.label, badgeStyle, logoOnly);
        return `  <a href="${item.url || "#"}" target="_blank"><img src="${badgeUrl}" alt="${item.label || item.platform}" /></a>`;
      });

      const joiner = layout === "column" ? "\n  <br/>\n" : "\n";
      return `<p align="${align}">\n${anchors.join(joiner)}\n</p>`;
    }

    case "roadmap": {
      const { items = [] } = props;
      if (items.length === 0) return "";
      return items
        .map((item: any) => `- [${item.done ? "x" : " "}] ${item.text}`)
        .join("\n");
    }

    case "divider": {
      const { style = "line", height = 24, color = "#262626" } = props;
      if (style === "line") {
        return `\n<hr style="height: 2px; border: none; background-color: ${color}; margin: 20px 0;" />\n`;
      }
      if (style === "dots") {
        return `\n<p align="center" style="color: ${color}; letter-spacing: 12px; font-weight: bold; font-size: 18px; margin: 15px 0;">••••••••••••</p>\n`;
      }
      if (style === "space") {
        return `\n<div style="height: ${height}px"></div>\n`;
      }
      if (style === "wave") {
        return `\n<p align="center"><img src="https://kroppy.github.io/readme-studio-banners/wave.svg?color=${encodeURIComponent(color)}" alt="wave divider" width="100%" /></p>\n`;
      }
      return "---";
    }

    case "video": {
      const { url = "", caption = "", width = 100, align = "center" } = props;
      if (!url) return "";

      const getYoutubeId = (youtubeUrl: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = youtubeUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const ytId = getYoutubeId(url);
      const alignHtml = align === "center" ? ' align="center"' : align === "right" ? ' align="right"' : "";

      if (ytId) {
        const thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        let md = `<div${alignHtml}>\n  <a href="${url}">\n    <img src="${thumb}" alt="${caption || "Watch video"}" width="${width}%" />\n  </a>\n`;
        if (caption) {
          md += `  <p><em>${caption}</em></p>\n`;
        }
        md += `</div>`;
        return md;
      } else {
        let md = `<div${alignHtml}>\n  <img src="${url}" alt="${caption || "Demo"}" width="${width}%" />\n`;
        if (caption) {
          md += `  <p><em>${caption}</em></p>\n`;
        }
        md += `</div>`;
        return md;
      }
    }

    case "code": {
      const { language = "typescript", filename = "", code = "", caption = "" } = props;
      let md = "";
      if (filename) {
        md += `**\`${filename}\`**\n\n`;
      }
      md += `\`\`\`${language}\n${code}\n\`\`\``;
      if (caption) {
        md += `\n\n<sub>${caption}</sub>`;
      }
      return md;
    }

    case "githubstats": {
      const username = (props.username || "torvalds").replace(/\s/g, "");
      const theme = props.theme || "github_dark";
      if (!username) return "";
      const card = props.statsType === "profile-details" ? "profile-details" : "stats";
      const src = `https://github-profile-summary-cards.vercel.app/api/cards/${card}?username=${username}&theme=${theme}`;
      return `[![GitHub Stats](${src})](https://github.com/${username})`;
    }

    case "typing": {
      const { lines = "", color = "6366F1", size = 26, font = "Fira Code", center = true, width = 500 } = props;
      const encodedLines = encodeURIComponent(
        String(lines).split(/[\n;]/).map((l: string) => l.trim()).filter(Boolean).join(";")
      );
      if (!encodedLines) return "";
      const url = `https://readme-typing-svg.demolab.com?font=${encodeURIComponent(font)}&size=${size}&duration=3000&pause=1000&color=${color}&center=${center}&vCenter=true&width=${width}&lines=${encodedLines}`;
      return `<p align="${center ? "center" : "left"}"><a href="https://git.io/typing-svg"><img src="${url}" alt="Typing SVG" /></a></p>`;
    }

    case "activity": {
      const { username = "username", theme = "github-compact", hideBorder = true } = props;
      if (!username) return "";
      const url = `https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme}&hide_border=${hideBorder}`;
      return `[![Activity Graph](${url})](https://github.com/${username})`;
    }

    case "views": {
      const { username = "username", label = "Profile Views", color = "6366F1", style = "flat" } = props;
      if (!username) return "";
      const url = `https://komarev.com/ghpvc/?username=${username}&label=${encodeURIComponent(label).replace(/%20/g, "+")}&color=${color}&style=${style}`;
      return `<p align="center"><img src="${url}" alt="${label}" /></p>`;
    }

    case "support": {
      const { buymeacoffee = "", kofi = "", paypal = "" } = props;
      const parts: string[] = [];
      if (buymeacoffee) parts.push(`<a href="https://www.buymeacoffee.com/${buymeacoffee}"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>`);
      if (kofi) parts.push(`<a href="https://ko-fi.com/${kofi}"><img src="https://img.shields.io/badge/Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi" /></a>`);
      if (paypal) parts.push(`<a href="https://paypal.me/${paypal}"><img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="PayPal" /></a>`);
      if (parts.length === 0) return "";
      return `<p align="center">${parts.join("\n")}</p>`;
    }

    default:
      return "";
  }
}

export function generateReadmeMarkdown(blocks: Block[]): string {
  const rootBlocks = blocks.filter((b) => !b.parentId);
  return rootBlocks.map((b) => blockToMarkdown(b, blocks)).join("\n\n");
}
