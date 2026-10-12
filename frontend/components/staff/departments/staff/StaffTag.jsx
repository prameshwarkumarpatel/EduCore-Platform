"use client";
import React from "react";

export default function StaffTag({ staff, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(staff?.id)}
      className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] ${selected ? "border-teal-400/40 bg-teal-500/15 text-teal-200" : "border-border/60 bg-muted/30 text-muted-foreground"}`}
    >
      {staff?.name || "—"}
    </button>
  );
}

