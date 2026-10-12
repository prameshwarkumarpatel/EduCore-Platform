"use client";
import React from "react";
import { User } from "lucide-react";

export default function PersonalInfoSection({ student }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <User className="h-4 w-4 text-violet-300" /> Personal
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">{student?.name || "—"}</div>
      <div className="text-xs text-muted-foreground mt-1">Enrollment: {student?.enrollmentId || "—"}</div>
    </div>
  );
}

