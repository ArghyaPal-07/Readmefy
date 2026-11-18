"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useReadmeStore } from "@/store/readmeStore";
import { generateReadmeMarkdown } from "@/utils/markdownGenerators";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import Canvas from "@/components/Canvas";
import RightSidebar from "@/components/RightSidebar";
import MarkdownEditor from "@/components/MarkdownEditor";
import GitHubPreview from "@/components/GitHubPreview";
import ConfirmDialog from "@/components/ConfirmDialog";
import TemplateLibrary from "@/components/TemplateLibrary";

import ImportModal from "@/components/ImportModal";
import PublishModal from "@/components/PublishModal";
import ExportModal from "@/components/ExportModal";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import CommandPalette from "@/components/CommandPalette";
import LintPanel from "@/components/LintPanel";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { toast } from "sonner";
import { Sparkles, LayoutGrid, MousePointer2, SlidersHorizontal, Keyboard } from "lucide-react";

export default function StudioHome() {
  const { 
    blocks, 
    projectName,
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    initFromStorage,
    duplicateSelectedBlocks,
    deleteSelectedBlocks,
    moveSelectedBlocks,
    clearMultiSelect,
    copySelectedBlocks,
    pasteBlocks,
    setBlocks,
    setProjectName,
    loadTemplate,
    resetStore
  } = useReadmeStore();

  const [viewMode, setViewMode] = useState<"design" | "markdown" | "adaptive">("design");
  const [customMarkdown, setCustomMarkdown] = useState<string | null>(null);

  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showAiBanner, setShowAiBanner] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"blocks" | "canvas" | "properties">("canvas");

  // Auto-dismiss the AI success banner so it doesn't linger.
  useEffect(() => {
    if (!showAiBanner) return;
    const t = setTimeout(() => setShowAiBanner(false), 6000);
    return () => clearTimeout(t);
  }, [showAiBanner]);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template");
    if (!templateParam) return;

    // loadTemplate no-ops on unknown ids, so we can pass any template param through
    loadTemplate(templateParam as any);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("template");
    const qs = newParams.toString();
    window.history.replaceState({}, "", `/studio${qs ? `?${qs}` : ""}`);
  }, [loadTemplate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const importUrl = params.get("importUrl");
    if (importUrl) {
      Promise.resolve().then(() => {
        setIsImportOpen(true);
      });
    }
  }, []);

  // Compute active markdown on the fly during render to avoid cascading renders
  const generatedMarkdown = useMemo(() => generateReadmeMarkdown(blocks), [blocks]);
  const markdownText = customMarkdown !== null ? customMarkdown : generatedMarkdown;

  useKeyboardShortcuts({
    onUndo: () => {
      if (canUndo()) undo();
    },
    onRedo: () => {
      if (canRedo()) redo();
    },
    onDuplicate: () => {
      duplicateSelectedBlocks();
    },
    onDelete: () => {
      deleteSelectedBlocks();
    },
    onMoveUp: () => {
      moveSelectedBlocks("up");
    },
    onMoveDown: () => {
      moveSelectedBlocks("down");
    },
    onEscape: () => {
      clearMultiSelect();
    },
    onTogglePalette: () => {
      setIsPaletteOpen(prev => !prev);
    },
    onSave: () => toast.success("Saved", { description: "Your changes are stored locally in this browser." }),
    onCopy: () => {
      copySelectedBlocks();
      toast.success("Copied to clipboard");
    },
    onPaste: () => {
      pasteBlocks();
      toast.success("Pasted from clipboard");
    },
    onOpenHelp: () => {
      setIsShortcutsOpen(true);
    }
  });

  const handleSetViewMode = (mode: "design" | "markdown" | "adaptive") => {
    if (mode === "design" && customMarkdown !== null && customMarkdown !== generatedMarkdown) {
      setIsDiscardOpen(true);
      return;
    }
    if (mode === "design") {
      setCustomMarkdown(null); // Reset custom edits so the visual editor drives the preview
    }
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-background text-foreground">
      {/* Navigation Header */}
      <Navbar 
        viewMode={viewMode} 
        setViewMode={handleSetViewMode} 
        openTemplateLibrary={() => setIsTemplateOpen(true)}
        openImportModal={() => setIsImportOpen(true)}
        openPublishModal={() => setIsPublishOpen(true)}
        openExportModal={() => setIsExportOpen(true)}
        onRequestReset={() => setIsResetOpen(true)}
        markdown={markdownText}
      />

      {viewMode === "design" && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-panel/70 px-3 py-2 text-xs">
          <div role="group" aria-label="Workspace panels" className="flex gap-1 lg:hidden">
            {([
              ["blocks", "Blocks", LayoutGrid],
              ["canvas", "Canvas", MousePointer2],
              ["properties", "Properties", SlidersHorizontal],
            ] as const).map(([id, label, Icon]) => (
              <button key={id} aria-pressed={mobilePanel === id} onClick={() => setMobilePanel(id)} className={`flex items-center gap-1.5 rounded-md px-2 py-2 transition-colors ${mobilePanel === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}><Icon className="size-3.5" />{label}</button>
            ))}
          </div>
          <p className="hidden lg:block text-muted-foreground"><span className="font-medium text-foreground">README.md</span><span className="mx-3 text-border">/</span>{blocks.length} blocks<span className="mx-3 text-border">·</span>Click a block to edit. Drag its handle to reorder.</p>
          <button onClick={() => setIsShortcutsOpen(true)} aria-label="Keyboard shortcuts" title="Keyboard shortcuts" className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Keyboard className="size-4" /><span className="hidden sm:inline">Shortcuts</span></button>
        </div>
      )}
      <main aria-label="README workspace" className="min-h-0 flex-1 flex overflow-hidden">
        {viewMode === "design" && (
          <>
            {/* Left sidebar: palette & layers */}
            <div className={`${mobilePanel === "blocks" ? "flex" : "hidden"} min-h-0 w-full lg:flex lg:w-auto shrink-0`}><LeftSidebar /></div>

            {/* Center Canvas with wrappers for layout banner & warning indicator */}
            <div className={`${mobilePanel === "canvas" ? "flex" : "hidden"} min-w-0 flex-1 lg:flex flex-col overflow-hidden relative`}>
              {showAiBanner && (
                <div className="bg-indigo-950/40 border-b border-indigo-900/30 px-6 py-2.5 text-xs text-indigo-400 flex items-center justify-between animate-in slide-in-from-top duration-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span><strong>AI Auto-Fill Completed:</strong> Canvas layout successfully generated from the GitHub repository!</span>
                  </div>
                  <button 
                    onClick={() => setShowAiBanner(false)}
                    className="text-neutral-450 hover:text-white px-2 py-0.5 rounded hover:bg-neutral-850 transition-colors cursor-pointer text-[11px]"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Canvas workspace area */}
              <Canvas />

              {/* Lint errors/warning indicator bottom overlay panel */}
              <LintPanel />
            </div>

            {/* Right sidebar: settings */}
            <div className={`${mobilePanel === "properties" ? "flex" : "hidden"} min-h-0 w-full lg:flex lg:w-auto shrink-0`}><RightSidebar /></div>
          </>
        )}

        {viewMode === "markdown" && (
          <MarkdownEditor
            value={markdownText} 
            onChange={setCustomMarkdown}
            onSyncApplied={() => setCustomMarkdown(null)}
          />
        )}

        {viewMode === "adaptive" && (
          <GitHubPreview 
            markdown={markdownText} 
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <TemplateLibrary 
        isOpen={isTemplateOpen} 
        onClose={() => setIsTemplateOpen(false)} 
      />



      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onAiSuccess={() => setShowAiBanner(true)}
      />

      <PublishModal 
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        markdown={markdownText}
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <KeyboardShortcutsModal 
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        setViewMode={handleSetViewMode}
        onCopy={async () => {
          try {
            await navigator.clipboard.writeText(markdownText);
            toast.success("Markdown copied to clipboard!");
          } catch {
            toast.error("Failed to copy markdown.");
          }
        }}
        onDownload={() => {
          const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "README.md");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("README.md downloaded successfully!");
        }}
        onPushGithub={() => setIsPublishOpen(true)}
        onImportGithub={() => setIsImportOpen(true)}
        onRequestReset={() => setIsResetOpen(true)}
        onSaveProject={() => toast.success("Saved", { description: "Your changes are stored locally in this browser." })}
        onOpenHelp={() => setIsShortcutsOpen(true)}
      />

      <ConfirmDialog
        open={isDiscardOpen}
        onOpenChange={setIsDiscardOpen}
        title="Return to Design?"
        description="Your Markdown edits haven't been synced to the canvas. Cancel and choose Sync to Canvas in Markdown to keep them, or discard the edits to return to Design."
        confirmLabel="Discard edits"
        destructive
        onConfirm={() => {
          setCustomMarkdown(null);
          setViewMode("design");
        }}
      />

      <ConfirmDialog
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        destructive
        title="Reset workspace?"
        description="This clears your current README and restores the default starter blocks. This can't be undone."
        confirmLabel="Reset"
        onConfirm={() => {
          resetStore();
          toast.success("Workspace reset to starter template.");
        }}
      />
    </div>
  );
}
