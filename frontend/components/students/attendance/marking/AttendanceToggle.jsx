"use client";
import React from "react";

export default function AttendanceToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {["Present", "Late", "Absent"].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={[
            "px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors",
            value === s ? "bg-primary text-primary-foreground border-primary" : "bg-background/50 border-border/60 text-muted-foreground hover:bg-muted/40",
          ].join(" ")}
        >
          {s === "Present" ? "P" : s === "Late" ? "L" : "A"}
        </button>
      ))}
    </div>
  );
}

