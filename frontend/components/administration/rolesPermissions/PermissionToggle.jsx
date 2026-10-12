"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function PermissionToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex h-6 w-10 items-center rounded-full border transition-colors px-0.5",
        checked
          ? "border-purple-400 bg-purple-500/70"
          : "border-muted bg-background/80 hover:bg-muted/60"
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow transform transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

