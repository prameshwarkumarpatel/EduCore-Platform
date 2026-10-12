"use client";
import React from "react";
import { TrendingUp } from "lucide-react";

export default function AttendanceSummaryCard({ summary }) {
  const pct = summary?.attendedPct ?? 0;
  const present = summary?.present ?? 0;
  const late = summary?.late ?? 0;
  const absent = summary?.absent ?? 0;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Attendance</div>
          <div className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">{pct}%</div>
          <div className="text-xs text-muted-foreground mt-1">Attended (Present + Late)</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <TrendingUp className="h-5 w-5 text-amber-300" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border/60 bg-background/40 p-2 text-center">
          <div className="text-[11px] text-muted-foreground">Present</div>
          <div className="font-extrabold text-foreground">{present}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/40 p-2 text-center">
          <div className="text-[11px] text-muted-foreground">Late</div>
          <div className="font-extrabold text-foreground">{late}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/40 p-2 text-center">
          <div className="text-[11px] text-muted-foreground">Absent</div>
          <div className="font-extrabold text-foreground">{absent}</div>
        </div>
      </div>
    </div>
  );
}

