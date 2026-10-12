"use client";
import React from "react";
import { Users } from "lucide-react";

export default function TotalStudentsCard({ total }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/15 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Total Students</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <Users className="h-4 w-4 text-sky-300" />
        </div>
      </div>
      <div className="mt-3 text-4xl font-extrabold tracking-tight text-foreground">{total ?? "—"}</div>
      <div className="mt-1 text-xs text-muted-foreground">Live count from enrollment records</div>
    </div>
  );
}

