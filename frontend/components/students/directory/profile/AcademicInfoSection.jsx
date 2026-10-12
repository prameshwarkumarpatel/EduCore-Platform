"use client";
import React from "react";
import { GraduationCap } from "lucide-react";

export default function AcademicInfoSection({ student }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <GraduationCap className="h-4 w-4 text-violet-300" /> Academic
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">
        {student?.assignedClass || "—"} / {student?.assignedSection || "—"}
      </div>
      <div className="text-xs text-muted-foreground mt-1">Status: {student?.status || "—"}</div>
    </div>
  );
}

