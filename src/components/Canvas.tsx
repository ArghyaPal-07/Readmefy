import React, { useState, useEffect } from "react";
import { useReadmeStore } from "@/store/readmeStore";
import { Block, BlockType } from "@/store/blockRegistry";
import { 
  Trash2, 
  Copy, 
  GripVertical, 
  FolderPlus,
  FolderOpen,
  StickyNote,
  Users,
  Play,
  Code2,
  FileText,
  Sparkles,
  MoveUp,
  MoveDown,
  Group,
  BarChart2,
  Type,
  Activity,
  Eye,
  Coffee,
  Check,
  TrendingUp
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { techToSlug as techSlug, deviconUrl } from "@/utils/techIcons";
import { socialBadgeUrl } from "@/utils/socialPlatforms";
import { blockIcons, blockLabels } from "./LeftSidebar";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface CanvasBlockWrapperProps {
  block: Block;
  children: React.ReactNode;
}

function CanvasBlockWrapper({ block, children }: CanvasBlockWrapperProps) {
  const { 
    selectedBlockId, 
    selectedBlockIds,
    selectBlock, 
    toggleMultiSelectBlock,
    removeBlock, 
    duplicateBlock,
    updateBlockNote
  } = useReadmeStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isSelected = selectedBlockIds.includes(block.id);
  const isNested = !!block.parentId;

  // Scroll the block toward the middle of the canvas when it becomes the
  // single selection (e.g. clicking it in the Layers panel).
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    nodeRef.current = node;
  };
  useEffect(() => {
    if (isSelected && selectedBlockIds.length === 1) {
      nodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected, selectedBlockIds.length]);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateBlock(block.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Toggle note field
    updateBlockNote(block.id, block._note !== undefined ? "" : "Sticky note comment");
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleMultiSelectBlock(block.id);
    } else {
      selectBlock(block.id);
    }
  };

  return (
    <div
      ref={setRefs}
      id={block.id}
      tabIndex={0}
      role="group"
      aria-label={`${blockLabels[block.type]} block${isSelected ? ", selected" : ""}`}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          if (e.shiftKey) toggleMultiSelectBlock(block.id);
          else selectBlock(block.id);
        }
      }}
      style={style}
      onClick={handleBlockClick}
      onContextMenu={handleContextMenu}
      className={`group relative rounded-lg transition-all duration-150 cursor-pointer ${
        isNested ? "ml-5 border-l border-dashed border-[#30363d] pl-4" : ""
      } ${
        isSelected
          ? "ring-2 ring-indigo-400/80 bg-indigo-500/[0.06]"
          : "hover:ring-1 hover:ring-white/10 hover:bg-white/[0.02]"
      }`}
      title="Right-click to add/toggle notes. Shift+click to multi-select."
    >
      {/* Left Drag Handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes} 
        {...listeners}
        aria-label={`Reorder ${blockLabels[block.type]} block`}
        className="absolute left-[-14px] top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none p-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-400 hover:text-white shadow-md z-10"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      {/* Hover Action Bar */}
      <div data-readme-block-controls className={`absolute right-3 top-[-14px] ${isSelected ? "opacity-100" : "opacity-0"} group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 p-1 rounded-lg shadow-xl z-20`}>
        <span className="text-[9px] text-neutral-400 px-1 font-mono select-none">
          {blockLabels[block.type]}
        </span>
        <button
          onClick={handleDuplicate}
          className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          title="Duplicate Block"
          aria-label={`Duplicate ${blockLabels[block.type]} block`}
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-md transition-colors"
          title="Delete Block"
          aria-label={`Delete ${blockLabels[block.type]} block`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Block Body Content */}
      <div className="px-3 py-2">
        {children}

        {/* Inline Yellow Sticky Note */}
        {block._note !== undefined && (
          <div data-readme-block-controls
            onClick={(e) => e.stopPropagation()} 
            className="mt-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-3 rounded-lg text-xs flex gap-2 items-start font-sans"
          >
            <StickyNote className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <textarea
                aria-label="Block note"
                value={block._note}
                onChange={(e) => updateBlockNote(block.id, e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none placeholder-yellow-500/50 text-xs text-yellow-100"
                placeholder="Write your editorial comment here..."
                rows={2}
              />
            </div>
            <button 
              onClick={() => updateBlockNote(block.id, undefined as any)} 
              className="text-neutral-500 hover:text-red-400 transition-colors"
              title="Remove note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 1. Header Block Visual
function VisualHeader({ props }: { props: Record<string, any> }) {
  const align = props.align || "center";
  const style = props.style || "gradient";
  const size = props.size || "banner";
  const fontClass = props.font === "mono" ? "font-mono" : props.font === "serif" ? "font-serif" : "font-sans";

  const hasLogo = props.logoType !== "none";
  const logoUrl = props.logoType === "auto" 
    ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&fit=crop&q=80" 
    : props.logoUrl;

  const bgStyles = React.useMemo(() => {
    if (props.bgType === "image" && props.bgImage) {
      return { backgroundImage: `url(${props.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (style === "gradient") {
      return { background: `linear-gradient(135deg, ${props.bgGradientStart || "#4f46e5"} 0%, ${props.bgGradientEnd || "#ec4899"} 100%)` };
    }
    if (style === "solid") {
      return { backgroundColor: props.bgColor || "#111827" };
    }
    return { backgroundColor: "transparent" };
  }, [props.bgType, props.bgImage, props.bgGradientStart, props.bgGradientEnd, props.bgColor, style]);

  const paddingClass = size === "compact" ? "py-8 px-6" : "py-16 px-8";

  const roundedClass = {
    none: "rounded-none",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-2xl",
  }[props.rounded as string] ?? "rounded-lg";

  const titleSizeClass = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
  }[props.titleSize as string] ?? "text-3xl";

  const logoShapeClass = {
    rounded: "rounded-xl",
    circle: "rounded-full",
    square: "rounded-none",
  }[props.logoShape as string] ?? "rounded-xl";

  const logoSize = Number(props.logoSize) || 64;
  const overlayOpacity = Math.min(Math.max(Number(props.overlay ?? 15), 0), 80) / 100;
  const shadow = props.textShadow ?? true;
  const titleColor = props.titleColor || "#ffffff";
  const subtitleColor = props.subtitleColor || "#d4d4d8";

  return (
    <div
      style={bgStyles}
      className={`${roundedClass} overflow-hidden flex flex-col relative ${paddingClass} ${
        style === "minimal" ? "border border-border bg-neutral-950" : ""
      } ${
        align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left"
      } ${fontClass}`}
    >
      {style !== "minimal" && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      )}

      <div className="relative z-10 flex flex-col items-inherit">
        {hasLogo && logoUrl && (
          <img
            src={logoUrl}
            alt={props.altText || "Logo"}
            style={{ width: logoSize, height: logoSize }}
            className={`${logoShapeClass} object-cover mb-4 border border-white/20 shadow-lg`}
          />
        )}
        <h1
          style={{ color: titleColor, textShadow: shadow ? "0 2px 8px rgba(0,0,0,0.35)" : "none" }}
          className={`${titleSizeClass} font-extrabold tracking-tight`}
        >
          {props.title || "Project Title"}
        </h1>
        {props.subtitle && (
          <p
            style={{ color: subtitleColor, textShadow: shadow ? "0 1px 4px rgba(0,0,0,0.3)" : "none" }}
            className="mt-2 text-sm font-medium max-w-lg"
          >
            {props.subtitle}
          </p>
        )}
      </div>

      {props.border && <div className="w-full h-[1px] bg-border mt-6 relative z-10" />}
      {props.watermark && (
        <div className="absolute bottom-2 right-3 text-[9px] text-white/40 font-mono tracking-wider">
          Readmefy
        </div>
      )}
    </div>
  );
}

// 2. Text Block Visual
function VisualText({ props }: { props: Record<string, any> }) {
  return (
    <div className="markdown-body select-text">
      {props.content ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {props.content}
        </ReactMarkdown>
      ) : (
        <span className="text-neutral-600 italic text-xs">Empty text block. Click to configure.</span>
      )}
    </div>
  );
}

// 3. Badges Block Visual
function VisualBadges({ props }: { props: Record<string, any> }) {
  const { packageName = "readme-studio", githubRepo = "username/repo", badgeList = [], badgeStyle = "flat", align = "left", gap = "normal", badgeColor = "" } = props;

  if (badgeList.length === 0) {
    return <span className="text-neutral-600 italic text-xs">No badges enabled.</span>;
  }

  const colorParam = badgeColor ? `&color=${badgeColor.replace("#", "")}` : "";

  const badgeUrls = badgeList.map((type: string) => {
    switch (type) {
      case "npm-v":
        return {
          name: "npm",
          img: `https://img.shields.io/npm/v/${packageName || "readme-studio"}.svg?style=${badgeStyle}${colorParam}`,
          url: `https://www.npmjs.com/package/${packageName || "readme-studio"}`
        };
      case "github-stars":
        return {
          name: "stars",
          img: `https://img.shields.io/github/stars/${githubRepo || "username/repo"}.svg?style=${badgeStyle}${colorParam}`,
          url: `https://github.com/${githubRepo || "username/repo"}`
        };
      case "license":
        return {
          name: "license",
          img: `https://img.shields.io/github/license/${githubRepo || "username/repo"}.svg?style=${badgeStyle}${colorParam}`,
          url: `https://github.com/${githubRepo || "username/repo"}`
        };
      case "github-status":
        return {
          name: "build status",
          img: `https://img.shields.io/github/actions/workflow/status/${githubRepo || "username/repo"}/ci.yml.svg?style=${badgeStyle}&label=build${colorParam}`,
          url: `https://github.com/${githubRepo || "username/repo"}/actions`
        };
      default:
        return null;
    }
  }).filter(Boolean);

  const justifyClass = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  const gapClass = gap === "tight" ? "gap-1" : gap === "wide" ? "gap-4" : "gap-2";

  return (
    <div className={`flex flex-wrap items-center ${justifyClass} ${gapClass}`}>
      {badgeUrls.map((badge: any, i: number) => (
        <a key={i} href={badge.url} target="_blank" rel="noreferrer" className="hover:scale-[1.03] transition-transform">
          <img src={badge.img} alt={badge.name} className="h-5" />
        </a>
      ))}
    </div>
  );
}

// 4. Group Block Visual
function VisualGroup({ props }: { props: Record<string, any> }) {
  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-2">
      <FolderOpen className="w-4 h-4 text-indigo-500" />
      <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
        {props.title || "Group Container"}
      </span>
      <span className="text-[10px] text-neutral-500 italic">(Group block)</span>
    </div>
  );
}

// Chart type → friendly label (github-profile-summary-cards)
export const CHART_TYPE_LABELS: Record<string, string> = {
  "repos-per-language": "Top Languages (by repos)",
  "most-commit-language": "Top Languages (by commits)",
  "productive-time": "Productive Time",
};

// 5. Chart Block Visual — reliable GitHub chart cards
function VisualChart({ props }: { props: Record<string, any> }) {
  const username = (props.username || "torvalds").replace(/\s/g, "");
  const chartType = props.chartType || "repos-per-language";
  const theme = props.theme || "github_dark";
  const chartUrl = `https://github-profile-summary-cards.vercel.app/api/cards/${chartType}?username=${username}&theme=${theme}`;
  const [errored, setErrored] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // reset error state when the source changes so edits re-attempt the load
  const [prevChartUrl, setPrevChartUrl] = useState(chartUrl);
  if (prevChartUrl !== chartUrl) {
    setPrevChartUrl(chartUrl);
    setErrored(false);
  }

  const label = CHART_TYPE_LABELS[chartType] || "GitHub Chart";

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-neutral-400">
        {label} · <span className="text-neutral-200 font-mono">@{username}</span>
      </div>
      <div className="w-full flex items-center justify-center rounded-lg bg-[#161b22] border border-[#30363d] overflow-hidden min-h-[150px]">
        {errored ? (
          <div className="flex flex-col items-center gap-2 py-10 px-6 text-center">
            <BarChart2 className="w-8 h-8 text-indigo-500/70" />
            <span className="text-xs font-medium text-neutral-300">{label}</span>
            <span className="text-[10px] font-mono text-neutral-500">@{username}</span>
            <button
              onClick={() => { setErrored(false); setReloadKey((k) => k + 1); }}
              className="mt-1 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium text-indigo-200 hover:bg-indigo-500/20 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <img
            key={reloadKey}
            src={chartUrl}
            alt={`${label} for ${username}`}
            className="max-h-[280px] w-full object-contain p-2"
            loading="lazy"
            onError={() => setErrored(true)}
          />
        )}
      </div>
    </div>
  );
}

// 6. Table Block Visual
function VisualTable({ props }: { props: Record<string, any> }) {
  const headers = props.headers || [];
  const rows = props.rows || [];

  if (headers.length === 0) {
    return <span className="text-neutral-600 italic text-xs">Table is empty.</span>;
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-neutral-950/40">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-neutral-900/60">
            {headers.map((header: string, idx: number) => (
              <th key={idx} className="p-3 font-semibold text-neutral-250 border-r border-border last:border-r-0">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string[], rowIdx: number) => (
            <tr key={rowIdx} className="border-b border-border last:border-0 hover:bg-neutral-900/20">
              {row.map((cell: string, colIdx: number) => (
                <td key={colIdx} className="p-3 text-neutral-300 border-r border-border last:border-r-0">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 7. Image Block Visual
function VisualImage({ props }: { props: Record<string, any> }) {
  const url = props.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";
  const caption = props.caption || "";
  const align = props.align || "center";
  const width = props.width || "100%";
  const alignStyles = align === "center" ? "mx-auto justify-center text-center" : align === "right" ? "ml-auto justify-end text-right" : "mr-auto justify-start text-left";

  return (
    <div className={`flex flex-col ${alignStyles}`} style={{ width }}>
      <div className="rounded-lg overflow-hidden border border-border bg-neutral-900 p-1 shadow-sm">
        <img src={url} alt={caption || "Image"} className="w-full object-cover" />
      </div>
      {caption && <span className="text-xs text-muted-foreground mt-2 italic">{caption}</span>}
    </div>
  );
}

// 8. Sponsors Block Visual
function VisualSponsors({ props }: { props: Record<string, any> }) {
  const sponsors = props.sponsors || [];
  const layout = props.layout || "grid";
  const title = props.title || "";
  const align = props.align || "center";
  const logoSize = Number(props.logoSize) || 64;
  const showNames = props.showNames ?? true;
  const shapeClass =
    props.logoShape === "square" ? "rounded-none" : props.logoShape === "rounded" ? "rounded-xl" : "rounded-full";

  const alignClass = align === "left" ? "justify-start text-left" : align === "right" ? "justify-end text-right" : "justify-center text-center";
  const titleAlign = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  const heading = title ? (
    <h3 className={`text-sm font-semibold text-neutral-200 mb-3 ${titleAlign}`}>{title}</h3>
  ) : null;

  if (sponsors.length === 0) {
    return (
      <div>
        {heading}
        <span className="text-neutral-600 italic text-xs">No sponsors configured.</span>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div>
        {heading}
        <div className={`flex flex-wrap items-start gap-5 py-2 ${alignClass}`}>
          {sponsors.map((sp: any, i: number) => (
            <a key={i} href={sp.link || "https://github.com"} target="_blank" rel="noreferrer" className="flex flex-col items-center group cursor-pointer">
              <img
                src={sp.logo}
                alt={sp.name}
                style={{ width: logoSize, height: logoSize }}
                className={`${shapeClass} border border-border group-hover:border-white/60 transition-all object-cover shadow-sm`}
              />
              {showNames && (
                <span className="text-[10px] text-muted-foreground group-hover:text-white mt-1.5 max-w-[80px] truncate">{sp.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {heading}
      <ul className="list-disc pl-5 text-xs text-neutral-300 space-y-1">
        {sponsors.map((sp: any, i: number) => (
          <li key={i}>
            <a href={sp.link || "https://github.com"} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
              {sp.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Single tech icon with graceful fallback: original → plain → letter badge
function TechIcon({ name, size }: { name: string; size: number }) {
  const slug = techSlug(name);
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0=original, 1=plain, 2=letter badge

  if (!slug || stage === 2) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold"
      >
        <span style={{ fontSize: Math.max(12, size * 0.4) }}>{name.trim().charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={deviconUrl(slug, stage === 0 ? "original" : "plain")}
      alt={name}
      className="object-contain"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setStage((s) => (s === 0 ? 1 : 2))}
    />
  );
}

// 9. Tech Stack Block Visual
function VisualTechStack({ props }: { props: Record<string, any> }) {
  const { techs = "React, TypeScript, Node.js", layout = "row", iconSize = 40, showLabel = true } = props;
  const techNames = techs.split(",").map((t: string) => t.trim()).filter(Boolean);

  if (techNames.length === 0) {
    return <span className="text-neutral-600 italic text-xs">Empty tech stack.</span>;
  }

  return (
    <div className={`flex flex-wrap gap-4 justify-center py-2 ${layout === "grid" ? "max-w-md mx-auto" : ""}`}>
      {techNames.map((tech: string, i: number) => (
        <div key={`${tech}-${i}`} className="flex flex-col items-center gap-1 p-2 bg-neutral-900/50 border border-neutral-850 rounded-lg min-w-[60px]">
          <TechIcon name={tech} size={iconSize} />
          {showLabel && <span className="text-[9px] font-semibold text-neutral-400">{tech}</span>}
        </div>
      ))}
    </div>
  );
}

// 10. Contributors Block Visual
function VisualContributors({ props }: { props: Record<string, any> }) {
  const { repo = "vercel/next.js", maxCount = 12, avatarSize = 48 } = props;
  const [contribs, setContribs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!repo) return;
    let active = true;

    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    fetch(`https://api.github.com/repos/${repo}/contributors?per_page=${maxCount}`)
      .then((res) => {
        if (!res.ok) throw new Error("Rate limit or invalid repo");
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data)) {
          setContribs(data);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repo, maxCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6 text-xs text-neutral-500 gap-2">
        <Users className="w-4 h-4 animate-bounce" /> Loading contributors list...
      </div>
    );
  }

  if (contribs.length === 0) {
    return (
      <div className="flex justify-center items-center py-6 text-xs text-neutral-600 italic">
        Contributors grid for <span className="font-mono text-[10px] ml-1">{repo}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 py-2">
      {contribs.map((user: any, i: number) => (
        <a key={i} href={user.html_url} target="_blank" rel="noreferrer" className="group cursor-pointer" title={user.login}>
          <img 
            src={user.avatar_url} 
            alt={user.login} 
            className="rounded-full border border-border hover:border-indigo-500 hover:scale-105 transition-all"
            style={{ width: avatarSize, height: avatarSize }}
          />
        </a>
      ))}
    </div>
  );
}

// 11. Socials Block Visual
function VisualSocials({ props }: { props: Record<string, any> }) {
  const { items = [], layout = "row", badgeStyle = "for-the-badge", align = "center", logoOnly = false } = props;

  if (items.length === 0) {
    return <span className="text-neutral-600 italic text-xs">No social profiles configured.</span>;
  }

  const alignClass = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const badgeHeight = badgeStyle === "for-the-badge" ? "h-7" : logoOnly ? "h-8" : "h-5";

  return (
    <div className={`flex gap-2 py-2 ${alignClass} ${layout === "column" ? "flex-col items-center" : "flex-wrap items-center"}`}>
      {items.map((item: any, i: number) => {
        const imgUrl = socialBadgeUrl(item.platform, item.label, badgeStyle, logoOnly);
        return (
          <a key={i} href={item.url || "#"} target="_blank" rel="noreferrer" className="hover:scale-[1.05] transition-transform">
            <img src={imgUrl} alt={item.platform} className={badgeHeight} />
          </a>
        );
      })}
    </div>
  );
}

// 12. Roadmap Block Visual (INLINE EDITABLE)
function VisualRoadmap({ props, blockId }: { props: Record<string, any>; blockId: string }) {
  const items = props.items || [];
  const { updateBlock } = useReadmeStore();

  if (items.length === 0) {
    return <span className="text-neutral-600 italic text-xs">Roadmap is empty. Add tasks.</span>;
  }

  const toggleDone = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newItems = items.map((item: any, idx: number) => {
      if (idx === index) return { ...item, done: !item.done };
      return item;
    });
    updateBlock(blockId, { items: newItems });
  };

  const editItemText = (index: number, val: string) => {
    const newItems = items.map((item: any, idx: number) => {
      if (idx === index) return { ...item, text: val };
      return item;
    });
    updateBlock(blockId, { items: newItems });
  };

  return (
    <div className="space-y-2 py-1 select-text">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex gap-2.5 items-center group/item" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={item.done} 
            onChange={() => {}} // handled by click
            onClick={(e) => toggleDone(e, i)}
            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-violet-600 focus:ring-indigo-500 cursor-pointer"
          />
          <input
            value={item.text}
            onChange={(e) => editItemText(i, e.target.value)}
            className={`flex-1 bg-transparent border-0 outline-none text-xs text-neutral-250 py-0.5 px-1 rounded hover:bg-neutral-900/50 focus:bg-neutral-900 focus:ring-1 focus:ring-neutral-750 transition-colors ${
              item.done ? "line-through text-neutral-600" : ""
            }`}
          />
        </div>
      ))}
    </div>
  );
}

// 13. Divider Block Visual
function VisualDivider({ props }: { props: Record<string, any> }) {
  const { style = "line", height = 24, color = "#262626" } = props;

  if (style === "line") {
    return <hr style={{ height: "2px", border: "none", backgroundColor: color, margin: "16px 0" }} />;
  }
  if (style === "dots") {
    return (
      <div 
        className="text-center font-bold text-lg leading-none py-2 tracking-[12px] select-none"
        style={{ color }}
      >
        ••••••••••••
      </div>
    );
  }
  if (style === "space") {
    return <div style={{ height }} />;
  }
  if (style === "wave") {
    return (
      <div className="flex justify-center py-2 select-none">
        <img 
          src={`https://kroppy.github.io/readme-studio-banners/wave.svg?color=${encodeURIComponent(color)}`} 
          alt="Divider Wave" 
          className="w-full object-contain"
        />
      </div>
    );
  }
  return null;
}

// 14. Video Block Visual
function VisualVideo({ props }: { props: Record<string, any> }) {
  const { url = "", caption = "", width = 100, align = "center" } = props;

  if (!url) {
    return <span className="text-neutral-600 italic text-xs">Enter video or GIF URL in settings.</span>;
  }

  const getYoutubeId = (youtubeUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYoutubeId(url);
  const alignStyles = align === "center" ? "mx-auto text-center" : align === "right" ? "ml-auto text-right" : "mr-auto text-left";

  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    return (
      <div className={`flex flex-col ${alignStyles}`} style={{ width: `${width}%` }}>
        <a href={url} target="_blank" rel="noreferrer" className="relative group rounded-lg overflow-hidden border border-border shadow-md block">
          <img src={thumb} alt={caption || "Watch video"} className="w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
            <div className="p-3 bg-red-600 text-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white" />
            </div>
          </div>
        </a>
        {caption && <span className="text-xs text-muted-foreground mt-2 italic">{caption}</span>}
      </div>
    );
  }

  const isVideoFile = /^data:video\//.test(url) || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

  return (
    <div className={`flex flex-col ${alignStyles}`} style={{ width: `${width}%` }}>
      {isVideoFile ? (
        <video src={url} controls className="rounded-lg border border-border w-full" />
      ) : (
        <img src={url} alt={caption || "Demo video"} className="rounded-lg border border-border" />
      )}
      {caption && <span className="text-xs text-muted-foreground mt-2 italic">{caption}</span>}
    </div>
  );
}

// 15. Code Block Visual
const CODE_THEMES: Record<string, { bg: string; header: string; text: string; border: string; lineNo: string }> = {
  "github-dark": { bg: "#0d1117", header: "#161b22", text: "#c9d1d9", border: "#30363d", lineNo: "#484f58" },
  "dracula": { bg: "#282a36", header: "#21222c", text: "#f8f8f2", border: "#44475a", lineNo: "#6272a4" },
  "one-dark": { bg: "#282c34", header: "#21252b", text: "#abb2bf", border: "#3e4451", lineNo: "#5c6370" },
  "nord": { bg: "#2e3440", header: "#272c36", text: "#d8dee9", border: "#434c5e", lineNo: "#4c566a" },
  "light": { bg: "#ffffff", header: "#f6f8fa", text: "#24292e", border: "#d0d7de", lineNo: "#8c959f" },
};

function VisualCode({ props }: { props: Record<string, any> }) {
  const {
    language = "typescript",
    filename = "",
    code = "",
    showLineNumbers = true,
    theme = "github-dark",
    wrap = false,
    showChrome = true,
    caption = "",
  } = props;
  const t = CODE_THEMES[theme] || CODE_THEMES["github-dark"];
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="space-y-1.5">
      <div
        className="rounded-xl overflow-hidden font-mono text-xs shadow-lg shadow-black/20"
        style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5 select-none"
          style={{ backgroundColor: t.header, borderBottom: `1px solid ${t.border}` }}
        >
          {showChrome && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="size-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/10" />
              <span className="size-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/10" />
              <span className="size-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/10" />
            </div>
          )}

          {filename && (
            <div className="flex items-center gap-1.5 min-w-0 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] ring-1 ring-inset ring-white/10" style={{ color: t.text }}>
              <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="truncate font-medium">{filename}</span>
            </div>
          )}

          <span className="ml-auto shrink-0 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            {language}
          </span>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="shrink-0 rounded-md p-1 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <pre className={`p-4 overflow-x-auto leading-relaxed ${wrap ? "whitespace-pre-wrap break-words" : ""}`} style={{ color: t.text }}>
          <code>
            {showLineNumbers ? (
              code.split("\n").map((line: string, i: number) => (
                <span key={i} className="table-row">
                  <span className="table-cell text-right pr-4 select-none text-[10px] w-6" style={{ color: t.lineNo }}>{i + 1}</span>
                  <span className="table-cell select-text text-left">{line || " "}</span>
                </span>
              ))
            ) : (
              <span className="select-text">{code}</span>
            )}
          </code>
        </pre>
      </div>
      {caption && (
        <p className="text-center text-[11px] italic text-neutral-500">{caption}</p>
      )}
    </div>
  );
}

// 16. GitHub Stats Block Visual — reliable profile-summary-cards
function VisualGitHubStats({ props }: { props: Record<string, any> }) {
  const username = (props.username || "torvalds").replace(/\s/g, "");
  const theme = props.theme || "github_dark";
  const card = props.statsType === "profile-details" ? "profile-details" : "stats";
  const imgUrl = `https://github-profile-summary-cards.vercel.app/api/cards/${card}?username=${username}&theme=${theme}`;
  const [errored, setErrored] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // reset error state when the source changes so edits re-attempt the load
  const [prevImgUrl, setPrevImgUrl] = useState(imgUrl);
  if (prevImgUrl !== imgUrl) {
    setPrevImgUrl(imgUrl);
    setErrored(false);
  }

  if (!username) {
    return <span className="text-neutral-600 italic text-xs">Set GitHub username in settings.</span>;
  }

  return (
    <div className="flex justify-center py-2 select-none">
      {errored ? (
        <div className="flex flex-col items-center gap-2 py-8 px-6 text-center">
          <TrendingUp className="w-8 h-8 text-indigo-500/70" />
          <span className="text-xs font-medium text-neutral-300">GitHub Stats</span>
          <span className="text-[10px] font-mono text-neutral-500">@{username}</span>
          <button
            onClick={() => { setErrored(false); setReloadKey((k) => k + 1); }}
            className="mt-1 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium text-indigo-200 hover:bg-indigo-500/20 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <img
          key={reloadKey}
          src={imgUrl}
          alt={`${username} GitHub stats`}
          className="max-w-full object-contain max-h-[220px]"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

// 17. Typing SVG Animation
function VisualTyping({ props }: { props: Record<string, any> }) {
  const { lines = "", color = "6366F1", size = 26, font = "Fira Code", center = true, width = 500 } = props;
  const [errored, setErrored] = useState(false);
  const encodedLines = encodeURIComponent(
    String(lines).split(/[\n;]/).map((l: string) => l.trim()).filter(Boolean).join(";")
  );
  const url = `https://readme-typing-svg.demolab.com?font=${encodeURIComponent(font)}&size=${size}&duration=3000&pause=1000&color=${color}&center=${center}&vCenter=true&width=${width}&lines=${encodedLines}`;

  return (
    <div className={`flex ${center ? "justify-center" : "justify-start"} py-2 select-none`}>
      {errored || !encodedLines ? (
        <div className="flex items-center gap-2 py-6 text-neutral-500">
          <Type className="w-5 h-5 text-indigo-500/70" />
          <span className="text-xs">Typing animation</span>
        </div>
      ) : (
        <img src={url} alt="Typing SVG" className="max-w-full" onError={() => setErrored(true)} />
      )}
    </div>
  );
}

// 18. GitHub Activity Graph
function VisualActivity({ props }: { props: Record<string, any> }) {
  const { username = "username", theme = "github-compact", hideBorder = true } = props;
  const [errored, setErrored] = useState(false);
  const url = `https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme}&hide_border=${hideBorder}`;

  return (
    <div className="w-full py-2 select-none">
      {errored ? (
        <div className="flex flex-col items-center gap-2 py-10 rounded-lg bg-[#161b22] border border-[#30363d] text-center">
          <Activity className="w-8 h-8 text-indigo-500/70" />
          <span className="text-xs text-neutral-400">Contribution activity graph</span>
          <span className="text-[10px] font-mono text-neutral-600">@{username}</span>
        </div>
      ) : (
        <img src={url} alt="Activity Graph" className="w-full rounded-lg" onError={() => setErrored(true)} />
      )}
    </div>
  );
}

// 19. Profile Views / Visitor Counter
function VisualViews({ props }: { props: Record<string, any> }) {
  const { username = "username", label = "Profile Views", color = "6366F1", style = "flat" } = props;
  const [errored, setErrored] = useState(false);
  const url = `https://komarev.com/ghpvc/?username=${username}&label=${encodeURIComponent(label).replace(/%20/g, "+")}&color=${color}&style=${style}`;

  return (
    <div className="flex justify-center py-2 select-none">
      {errored ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-[#161b22] border border-[#30363d] px-3 py-1 rounded">
          <Eye className="w-3.5 h-3.5 text-indigo-500/70" /> {label}
        </span>
      ) : (
        <img src={url} alt={label} className="h-5" onError={() => setErrored(true)} />
      )}
    </div>
  );
}

// 20. Support / Donate Buttons
function VisualSupport({ props }: { props: Record<string, any> }) {
  const { buymeacoffee = "", kofi = "", paypal = "" } = props;
  const badges: { src: string; alt: string }[] = [];
  if (buymeacoffee) badges.push({ src: "https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black", alt: "Buy Me A Coffee" });
  if (kofi) badges.push({ src: "https://img.shields.io/badge/Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white", alt: "Ko-fi" });
  if (paypal) badges.push({ src: "https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white", alt: "PayPal" });

  return (
    <div className="flex flex-wrap justify-center gap-2 py-2 select-none">
      {badges.length === 0 ? (
        <div className="flex items-center gap-2 py-4 text-neutral-500">
          <Coffee className="w-5 h-5 text-indigo-500/70" />
          <span className="text-xs">Add a support username in settings</span>
        </div>
      ) : (
        badges.map((b) => <img key={b.alt} src={b.src} alt={b.alt} className="h-8" />)
      )}
    </div>
  );
}

export default function Canvas() {
  const { 
    blocks, 
    selectedBlockIds, 
    selectBlock, 
    reorderBlocks,
    loadTemplate,
    addBlock,
    groupSelectedBlocks,
    deleteSelectedBlocks,
    moveSelectedBlocks,
    duplicateSelectedBlocks
  } = useReadmeStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = blocks.findIndex((b) => b.id === active.id);
    const toIndex = blocks.findIndex((b) => b.id === over.id);
    reorderBlocks(fromIndex, toIndex);
  };

  const renderBlockVisual = (block: Block) => {
    switch (block.type) {
      case "header": return <VisualHeader props={block.props} />;
      case "text": return <VisualText props={block.props} />;
      case "badges": return <VisualBadges props={block.props} />;
      case "group": return <VisualGroup props={block.props} />;
      case "chart": return <VisualChart props={block.props} />;
      case "table": return <VisualTable props={block.props} />;
      case "image": return <VisualImage props={block.props} />;
      case "sponsors": return <VisualSponsors props={block.props} />;
      
      // 8 new blocks
      case "techstack": return <VisualTechStack props={block.props} />;
      case "contributors": return <VisualContributors props={block.props} />;
      case "socials": return <VisualSocials props={block.props} />;
      case "roadmap": return <VisualRoadmap props={block.props} blockId={block.id} />;
      case "divider": return <VisualDivider props={block.props} />;
      case "video": return <VisualVideo props={block.props} />;
      case "code": return <VisualCode props={block.props} />;
      case "githubstats": return <VisualGitHubStats props={block.props} />;

      // Dynamic / profile components
      case "typing": return <VisualTyping props={block.props} />;
      case "activity": return <VisualActivity props={block.props} />;
      case "views": return <VisualViews props={block.props} />;
      case "support": return <VisualSupport props={block.props} />;

      default: return null;
    }
  };

  const blockIds = blocks.map((b) => b.id);
  const isMultiSelect = selectedBlockIds.length > 1;

  // Drag a block type from the Add Block palette and drop it onto the canvas.
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePaletteDrop = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData("application/readmefy-block") as BlockType;
    if (type) {
      e.preventDefault();
      addBlock(type);
      toast.success(`Added ${blockLabels[type]} block`);
    }
    setIsDragOver(false);
  };

  return (
    <div
      aria-label="Visual README canvas"
      className="min-h-0 min-w-0 flex-1 bg-[#080b10] bg-dot-grid overflow-auto px-4 py-6 sm:px-7 sm:py-8 flex flex-col items-center justify-start relative"
      onClick={() => selectBlock(null)}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("application/readmefy-block")) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          if (!isDragOver) setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
      }}
      onDrop={handlePaletteDrop}
    >
      {/* Floating Multi-Select Toolbar (Requirement 13) */}
      {isMultiSelect && (
        <div className="sticky top-0 max-w-full shrink-0 mb-5 z-40 bg-neutral-900 border border-neutral-800 px-3 py-2.5 rounded-xl shadow-xl flex flex-wrap items-center gap-3 select-none">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-semibold border-r border-border pr-3">
            <Group className="w-4 h-4 text-indigo-500" />
            <span>{selectedBlockIds.length} blocks selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="xs" variant="outline" onClick={groupSelectedBlocks} className="text-xs bg-neutral-950 border-neutral-800 hover:bg-neutral-800">
              Group
            </Button>
            <Button size="xs" variant="outline" onClick={duplicateSelectedBlocks} className="text-xs bg-neutral-950 border-neutral-800 hover:bg-neutral-800">
              Duplicate
            </Button>
            <Button size="xs" variant="outline" onClick={() => moveSelectedBlocks("up")} className="text-xs bg-neutral-950 border-neutral-800 hover:bg-neutral-800 flex items-center">
              <MoveUp className="w-3 h-3 mr-1" /> Up
            </Button>
            <Button size="xs" variant="outline" onClick={() => moveSelectedBlocks("down")} className="text-xs bg-neutral-950 border-neutral-800 hover:bg-neutral-800 flex items-center">
              <MoveDown className="w-3 h-3 mr-1" /> Down
            </Button>
            <Button size="xs" variant="destructive" onClick={deleteSelectedBlocks} className="text-xs flex items-center">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* Canvas Box — mirrors a GitHub README page */}
      <div data-readme-export className={`w-full max-w-[820px] shrink-0 bg-[#0d1117] rounded-xl px-4 py-7 sm:px-7 sm:py-8 h-fit shadow-xl shadow-black/20 space-y-1.5 transition-colors ${
        isDragOver
          ? "border-2 border-dashed border-indigo-500/70 ring-4 ring-indigo-500/10"
          : "border border-[#30363d] ring-1 ring-black/20"
      }`}>
        {/* Onboarding Empty Canvas State (Requirement 11) */}
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none">
            <div className="p-4 bg-neutral-900 border border-neutral-850 text-indigo-500 rounded-full mb-4">
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            
            <h2 className="text-lg font-bold text-neutral-200">Start your README</h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-[320px] leading-relaxed">
              Pick a template to get started fast, or add blocks one by one to compose your canvas from scratch.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <Button onClick={() => addBlock("header")} variant="outline" className="text-xs bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:text-white">
                Add Header Block
              </Button>
            </div>

            {/* Quick-start template pills */}
            <div className="mt-8 pt-6 border-t border-neutral-900 w-full max-w-sm">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-3">Quick-Start Templates</span>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "NPM Package", type: "npm-package" },
                  { label: "Personal Profile", type: "profile-readme" },
                  { label: "Web3 Project", type: "web3-solana" },
                  { label: "API Docs", type: "rest-api" }
                ].map((tpl) => (
                  <button
                    key={tpl.type}
                    onClick={() => loadTemplate(tpl.type as any)}
                    className="px-2.5 py-1 text-[10px] font-medium border border-neutral-850 bg-neutral-900/50 hover:bg-neutral-900 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <DndContext
            id="readmefy-canvas"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blockIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.map((block) => (
                  <CanvasBlockWrapper key={block.id} block={block}>
                    {renderBlockVisual(block)}
                  </CanvasBlockWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
