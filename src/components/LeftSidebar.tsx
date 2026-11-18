import React, { useState } from "react";
import { useReadmeStore } from "@/store/readmeStore";
import { Block, BlockType } from "@/store/blockRegistry";
import { toast } from "sonner";
import { 
  Heading, 
  AlignLeft, 
  Award, 
  Folder, 
  TrendingUp, 
  Table, 
  Image, 
  Heart,
  GripVertical,
  Cpu,
  Users,
  Share2,
  CheckSquare,
  Minus,
  Play,
  Code2,
  BarChart2,
  StickyNote,
  Search,
  Layers,
  LayoutGrid,
  Type,
  Activity,
  Eye,
  Coffee,
  X
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

// Icon mapping per block type
export const blockIcons: Record<BlockType, React.ComponentType<any>> = {
  header: Heading,
  text: AlignLeft,
  badges: Award,
  group: Folder,
  chart: BarChart2,
  table: Table,
  image: Image,
  sponsors: Heart,
  techstack: Cpu,
  contributors: Users,
  socials: Share2,
  roadmap: CheckSquare,
  divider: Minus,
  video: Play,
  code: Code2,
  githubstats: TrendingUp,
  typing: Type,
  activity: Activity,
  views: Eye,
  support: Coffee,
};

// Friendly labels for each block type
export const blockLabels: Record<BlockType, string> = {
  header: "Header",
  text: "Text / Markdown",
  badges: "Badges",
  group: "Group",
  chart: "GitHub Chart",
  table: "Table",
  image: "Image",
  sponsors: "Sponsors Grid",
  techstack: "Tech Stack",
  contributors: "Contributors",
  socials: "Social Badges",
  roadmap: "Checklist",
  divider: "Divider",
  video: "Video / GIF",
  code: "Code Snippet",
  githubstats: "GitHub Stats",
  typing: "Typing Animation",
  activity: "Activity Graph",
  views: "Profile Views",
  support: "Support / Donate",
};

const blockCategories: { label: string; types: BlockType[] }[] = [
  { label: "Content", types: ["header", "text", "table", "code", "image", "video", "divider", "group"] },
  { label: "Badges & links", types: ["badges", "socials", "techstack", "support"] },
  { label: "GitHub & profile", types: ["githubstats", "chart", "activity", "views", "contributors", "sponsors", "typing", "roadmap"] },
];

interface SortableLayerItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

function SortableLayerItem({ block, isSelected, onSelect }: SortableLayerItemProps) {
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
    opacity: isDragging ? 0.4 : 1,
  };

  const Icon = blockIcons[block.type] || AlignLeft;
  
  let displayName = blockLabels[block.type];
  if (block.type === "header" && block.props.title) {
    displayName = block.props.title;
  } else if (block.type === "text" && block.props.content) {
    const firstLine = block.props.content.trim().split("\n")[0] || "";
    displayName = firstLine.replace(/[#*`[\]]/g, "").slice(0, 18) || "Markdown Text";
  } else if (block.type === "badges" && block.props.packageName) {
    displayName = `Badges: ${block.props.packageName}`;
  } else if (block.type === "chart" && block.props.username) {
    displayName = `Chart: @${block.props.username}`;
  } else if (block.type === "group" && block.props.title) {
    displayName = block.props.title;
  } else if (block.type === "image" && block.props.caption) {
    displayName = `Image: ${block.props.caption}`;
  } else if (block.type === "techstack" && block.props.techs) {
    displayName = `Stack: ${block.props.techs.split(",")[0] || "Tech"}`;
  } else if (block.type === "contributors" && block.props.repo) {
    displayName = `Contribs: ${block.props.repo.split("/")[1] || "Repo"}`;
  } else if (block.type === "roadmap" && block.props.items) {
    displayName = `Roadmap (${block.props.items.length})`;
  } else if (block.type === "divider") {
    displayName = `Divider: ${block.props.style}`;
  } else if (block.type === "code" && block.props.filename) {
    displayName = block.props.filename;
  } else if (block.type === "githubstats" && block.props.username) {
    displayName = `@${block.props.username} Stats`;
  }

  const isNested = !!block.parentId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(e);
        }
      }}
      tabIndex={0}
      role="group"
      aria-current={isSelected ? "true" : undefined}
      aria-label={`Select ${displayName}`}
      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border text-xs select-none ${
        isNested ? "ml-5 bg-panel/50 border-dashed border-border" : "bg-card border-transparent"
      } ${
        isSelected 
          ? "border-indigo-500/50 bg-indigo-500/10 text-white" 
          : "hover:bg-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${displayName}`}
          className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground p-1.5 rounded group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-indigo-500" : "text-muted-foreground"}`} />
        <span className="truncate font-medium">{displayName}</span>
      </div>

      {block._note && block._note.trim() !== "" && (
        <span title="Has sticky comment note">
          <StickyNote className="w-3.5 h-3.5 text-yellow-500/80 shrink-0" />
        </span>
      )}
    </div>
  );
}

export default function LeftSidebar() {
  const { 
    blocks, 
    selectedBlockId, 
    selectedBlockIds,
    addBlock, 
    selectBlock,
    toggleMultiSelectBlock,
    reorderBlocks 
  } = useReadmeStore();

  const [filterNotesOnly, setFilterNotesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [panel, setPanel] = useState<"blocks" | "layers">("blocks");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
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

  const handleSelectBlock = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleMultiSelectBlock(id);
    } else {
      selectBlock(id);
    }
  };

  const filteredBlocks = filterNotesOnly 
    ? blocks.filter(b => b._note && b._note.trim() !== "")
    : blocks;
  const blockIds = filteredBlocks.map((b) => b.id);

  const paletteItems: { type: BlockType; label: string; icon: React.ComponentType<any> }[] = Object.keys(blockLabels).map((key) => ({
    type: key as BlockType,
    label: blockLabels[key as BlockType],
    icon: blockIcons[key as BlockType],
  }));

  const filteredPalette = paletteItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBlockForAdd = blocks.find((b) => b.id === selectedBlockId);
  const activeParentId =
    selectedBlockForAdd?.type === "group"
      ? selectedBlockForAdd.id
      : selectedBlockForAdd?.parentId;
  const activeGroup = activeParentId
    ? blocks.find((b) => b.id === activeParentId)
    : undefined;

  const handleAddBlock = (type: BlockType) => {
    addBlock(type, activeParentId);
    if (activeGroup) {
      toast.success(`Added ${blockLabels[type]} inside "${activeGroup.props.title || "Group"}"`);
    } else {
      toast.success(`Added ${blockLabels[type]} block!`);
    }
  };

  return (
    <aside aria-label="Component library and layers" className="flex h-full min-h-0 w-full flex-col select-none border-r border-border bg-panel lg:w-60 shrink-0">
      <div className="flex gap-1 border-b border-border p-2" role="group" aria-label="Library panels">
        <button onClick={() => setPanel("blocks")} aria-pressed={panel === "blocks"} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${panel === "blocks" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="size-3.5" />Blocks</button>
        <button onClick={() => setPanel("layers")} aria-pressed={panel === "layers"} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${panel === "layers" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}><Layers className="size-3.5" />Layers <span className="text-[10px] text-muted-foreground">{blocks.length}</span></button>
      </div>
      
      {/* 1st Column: Add Block Menu (Darker, slimmer) */}
      <div className={`${panel === "blocks" ? "flex" : "hidden"} min-h-0 flex-1 bg-panel flex-col`}>
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 text-white font-semibold mb-4 text-sm tracking-tight">
            <LayoutGrid className="w-4 h-4 text-indigo-500" />
            Add to your README
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              aria-label="Search blocks"
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-md h-8 pl-8 pr-2 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {activeGroup && (
          <div className="mx-3 mb-2 flex items-center gap-1.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 pl-2 pr-1 py-1">
            <Folder className="w-3 h-3 shrink-0 text-indigo-400" />
            <span className="truncate text-[11px] font-medium text-indigo-200">
              {activeGroup.props.title || "Group"}
            </span>
            <button
              onClick={() => selectBlock(null)}
              title="Exit group"
              className="ml-auto shrink-0 p-0.5 rounded text-indigo-300/70 hover:text-white hover:bg-indigo-500/30 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 custom-scrollbar">
          {filteredPalette.length === 0 && <p className="px-3 py-6 text-center text-xs leading-relaxed text-muted-foreground">No blocks match “{searchQuery}”. Try a different search.</p>}
          {blockCategories.map((category) => {
            const items = filteredPalette.filter((item) => category.types.includes(item.type));
            if (items.length === 0) return null;
            return <section key={category.label} aria-label={category.label} className="mb-4">
              <h3 className="px-3 pt-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{category.label}</h3>
              {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                aria-label={`Add ${item.label}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/readmefy-block", item.type);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => handleAddBlock(item.type)}
                className="w-full flex min-h-10 items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-accent transition-colors text-left group cursor-grab active:cursor-grabbing"
                title="Click or drag onto the canvas to add"
              >
                <Icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                <span className="text-xs font-medium truncate">{item.label}</span>
                <GripVertical className="w-3.5 h-3.5 ml-auto shrink-0 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
              })}
            </section>;
          })}
        </div>
        <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">Click to add, or drag onto the canvas.</p>
      </div>

      {/* 2nd Column: Layers Panel (Lighter, wider) */}
      <div className={`${panel === "layers" ? "flex" : "hidden"} min-h-0 flex-1 bg-panel flex-col`}>
        <div className="p-4 pb-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-tight">
            <Layers className="w-4 h-4 text-indigo-500" />
            Layers
          </div>
          <button
            onClick={() => setFilterNotesOnly(!filterNotesOnly)}
            className={`p-1.5 rounded-md transition-colors ${
              filterNotesOnly 
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
            title="Filter by sticky notes"
            aria-label="Filter layers by sticky notes"
            aria-pressed={filterNotesOnly}
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {filteredBlocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg">
              <Layers className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                {filterNotesOnly ? "No blocks have comments." : "Your canvas is empty. Add a block from the left menu."}
              </p>
            </div>
          ) : (
            <DndContext id="readmefy-layers" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {filteredBlocks.map((block) => (
                    <SortableLayerItem
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockIds.includes(block.id)}
                      onSelect={(e) => handleSelectBlock(e, block.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

    </aside>
  );
}
