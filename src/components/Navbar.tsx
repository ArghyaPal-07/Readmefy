import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useReadmeStore } from "@/store/readmeStore";
import { analyzeBlocks } from "@/utils/lintAnalyzer";
import { 
  Copy, 
  Download, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Sparkles,
  FileCode,
  Eye,
  LayoutTemplate,
  LayoutGrid,
  FolderOpen,
  Globe,
  ImageIcon,
  FileText,
  Pencil,
  ChevronDown
} from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import ReadmefyLogo from "@/components/ReadmefyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface NavbarProps {
  viewMode: "design" | "markdown" | "adaptive";
  setViewMode: (mode: "design" | "markdown" | "adaptive") => void;
  openTemplateLibrary: () => void;
  openImportModal: () => void;
  openPublishModal: () => void;
  openExportModal: () => void;
  onRequestReset: () => void;
  markdown: string;
}

export default function Navbar({ 
  viewMode, 
  setViewMode, 
  openTemplateLibrary,
  openImportModal,
  openPublishModal,
  openExportModal,
  onRequestReset,
  markdown
}: NavbarProps) {
  const {
    blocks,
    projectName,
    setProjectName,
    undo,
    redo, 
    canUndo, 
    canRedo
  } = useReadmeStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const warnings = useMemo(() => analyzeBlocks(blocks), [blocks]);
  const warningsCount = warnings.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Markdown copied to clipboard!", {
        description: "You can now paste it directly into your GitHub README.md",
      });
    } catch (err) {
      toast.error("Failed to copy markdown.");
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "README.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded successfully!");
    setDownloadOpen(false);
  };

  const handleReset = () => {
    onRequestReset();
  };


  const saveProjectName = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      setProjectName(tempName.trim());
      toast.success("Project renamed to: " + tempName.trim());
    } else {
      setTempName(projectName);
    }
  };

  return (
    <header className="z-50 w-full shrink-0 border-b border-border bg-panel text-foreground grid grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 gap-y-3 px-3 py-3 sm:px-4 select-none">
      {/* Left side: Project name edit & Count */}
      <div className="col-span-2 sm:col-span-1 flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 rounded-lg text-white" aria-label="Readmefy — home" title="Readmefy — home">
            <ReadmefyLogo className="size-7 shrink-0" />
            <span className="text-sm font-semibold">Readmefy</span>
          </Link>
        </div>

        {/* Project Rename trigger (Requirement 5) */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-1.5 h-7 pl-2 rounded-md border border-indigo-500/50 bg-background ring-2 ring-indigo-500/15 max-w-[200px]">
              <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <Input
                aria-label="Project name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={saveProjectName}
                onKeyDown={(e) => e.key === "Enter" && saveProjectName()}
                className="h-6 text-xs font-semibold bg-transparent border-0 shadow-none px-0 pr-2 max-w-[150px] focus-visible:ring-0"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(projectName);
                setIsEditingName(true);
              }}
              className="group min-w-0 flex items-center gap-1.5 h-7 px-2 rounded-md hover:bg-accent transition-colors max-w-[210px] cursor-pointer"
              title="Click to rename project"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-indigo-400" />
              <span className="text-xs font-semibold truncate tracking-tight text-foreground">
                {projectName}
              </span>
              <Pencil className="w-3 h-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}

          <span className="hidden sm:inline text-[9px] font-medium uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/20 shrink-0">
            Beta
          </span>
        </div>
      </div>

      {/* Center: Tabs with lint count warning badge (Requirement 10) */}
      <div role="group" aria-label="Editor view" className="col-span-2 sm:col-span-1 justify-self-start sm:justify-self-center flex items-center bg-background border border-border p-0.5 rounded-lg shrink-0">
        <button
          aria-pressed={viewMode === "design"}
          onClick={() => setViewMode("design")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
            viewMode === "design"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Design</span>
          {warningsCount > 0 && (
            <span aria-label={`${warningsCount} lint warnings`} className="hidden sm:inline text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.25 rounded-full border border-amber-500/30">
              {warningsCount}
            </span>
          )}
        </button>
        <button
          aria-pressed={viewMode === "markdown"}
          onClick={() => setViewMode("markdown")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
            viewMode === "markdown"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          Markdown
        </button>
        <button
          aria-pressed={viewMode === "adaptive"}
          onClick={() => setViewMode("adaptive")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
            viewMode === "adaptive"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>

      {/* Right side: Advanced Action triggers */}
      <div aria-label="Document actions" className="col-span-2 xl:col-span-1 min-w-0 w-full flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 xl:justify-end [&>*]:shrink-0">
        {/* Undo/Redo */}
        <div className="flex items-center border-r border-border pr-2 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo()}
            className="w-7 h-7 text-muted-foreground hover:text-white disabled:opacity-40"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo()}
            className="w-7 h-7 text-muted-foreground hover:text-white disabled:opacity-40"
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>
        </div>


        {/* Templates */}
        <Button
          variant="outline"
          size="sm"
          onClick={openTemplateLibrary}
          className="flex items-center gap-1 border-border hover:bg-accent text-xs h-8 px-2.5"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
          Templates
        </Button>

        {/* Import AI */}
        <Button
          variant="outline"
          size="sm"
          onClick={openImportModal}
          className="flex items-center gap-1 border-border hover:bg-accent text-xs h-8 px-2.5"
          title="AI Import from Repo URL"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          AI Import
        </Button>

        {/* Publish */}
        <Button
          variant="outline"
          size="sm"
          onClick={openPublishModal}
          className="flex items-center gap-1 border-border hover:bg-accent text-xs h-8 px-2.5"
          title="Publish README to GitHub"
        >
          <GithubIcon className="w-3.5 h-3.5 text-indigo-500" />
          Publish
        </Button>


        {/* Copy */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1 border-border hover:bg-accent text-xs h-8 px-2.5"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </Button>

        {/* Download & Export Image Dropdown Menu (Requirement 6) */}
        <Popover open={downloadOpen} onOpenChange={setDownloadOpen}>
          <PopoverTrigger className="inline-flex items-center justify-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-500/15 hover:bg-indigo-500/25 text-xs h-8 px-2.5 font-medium cursor-pointer text-indigo-200 shadow-xs transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-panel border-border p-1 text-xs select-none">
            <button
              onClick={handleDownloadMarkdown}
              className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-white flex items-center gap-2 cursor-pointer font-medium"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              Download README.md
            </button>
            <button
              onClick={() => {
                setDownloadOpen(false);
                openExportModal();
              }}
              disabled={viewMode === "markdown"}
              title={viewMode === "markdown" ? "Switch to Design or Preview to export an image" : undefined}
              className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-white flex items-center gap-2 cursor-pointer font-medium"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
              Export as PNG Image
            </button>
          </PopoverContent>
        </Popover>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 text-xs h-8 px-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>
    </header>
  );
}
