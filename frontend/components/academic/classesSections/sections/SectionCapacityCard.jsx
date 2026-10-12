"use client";
import React from "react";

export default function SectionCapacityCard({ capacity = 0, studentCount = 0 }) {
  const used = capacity > 0 ? Math.min(100, Math.round((studentCount / capacity) * 100)) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="text-xs text-muted-foreground">{studentCount}/{capacity}</div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
        <div className={`h-full ${used >= 90 ? "bg-red-500" : used >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${used}%` }} />
      </div>
    </div>
  );
}
