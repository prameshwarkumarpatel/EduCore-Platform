"use client";
import React from "react";

export default function LessonProgressChart({ byStatus = {} }) {
  const entries = Object.entries(byStatus);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div className="flex items-end gap-2 h-24 mt-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t bg-primary/50" style={{ height: `${(v / max) * 100}%`, minHeight: 8 }} title={`${k}: ${v}`} />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{k}</span>
        </div>
      ))}
    </div>
  );
}
