"use client";
import React from "react";
import { GraduationCap } from "lucide-react";

export default function GPAOverviewCard({ overallGpa, latestGpa }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">GPA (Overview)</div>
          <div className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">{overallGpa ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-1">Latest GPA: {latestGpa ?? 0}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <GraduationCap className="h-5 w-5 text-blue-300" />
        </div>
      </div>
    </div>
  );
}

