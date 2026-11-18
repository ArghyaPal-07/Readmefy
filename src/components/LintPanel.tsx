import React, { useState } from "react";
import { useReadmeStore } from "@/store/readmeStore";
import { analyzeBlocks, LintWarning } from "@/utils/lintAnalyzer";
import { 
  AlertTriangle, 
  X, 
  AlertCircle, 
  Info,
  CheckCircle2
} from "lucide-react";

export default function LintPanel() {
  const { blocks, selectBlock } = useReadmeStore();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const warnings = analyzeBlocks(blocks);
  const activeWarnings = warnings.filter(w => !dismissedIds.includes(w.id));

  if (activeWarnings.length === 0) return null;

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissedIds([...dismissedIds, id]);
  };

  const handleSelectBlock = (blockId: string) => {
    selectBlock(blockId);
    // Find the element and scroll into view smoothly
    const el = document.getElementById(blockId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full max-h-32 shrink-0 overflow-y-auto p-3 bg-background border border-border select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
          README Lint Warnings ({activeWarnings.length})
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeWarnings.map((warn) => {
          const isError = warn.severity === "error";
          const isWarning = warn.severity === "warning";
          
          let severityColor = "bg-panel border-border text-muted-foreground hover:text-white";
          let Icon = Info;
          
          if (isError) {
            severityColor = "bg-red-950/20 border-red-900/30 text-red-300 hover:bg-red-900/30";
            Icon = AlertCircle;
          } else if (isWarning) {
            severityColor = "bg-amber-950/20 border-amber-900/30 text-amber-300 hover:bg-amber-900/30";
            Icon = AlertTriangle;
          }

          return (
            <div
              key={warn.id}
              role="group"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${severityColor}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <button onClick={() => handleSelectBlock(warn.blockId)} className="text-left truncate max-w-[200px] sm:max-w-[280px]">{warn.message}</button>
              <button
                onClick={(e) => handleDismiss(e, warn.id)}
                className="p-0.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
                title="Dismiss warning"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
