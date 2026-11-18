"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

/**
 * A styled confirmation dialog to replace native window.confirm(),
 * so destructive actions match the app's design instead of the browser chrome.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-panel border-border text-foreground select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold">
            {destructive && (
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            className={`text-xs h-8 ${destructive ? "bg-red-500 text-white hover:bg-red-500/90" : "btn-brand"}`}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
