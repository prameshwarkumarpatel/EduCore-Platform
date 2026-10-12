"use client";
import React from "react";

export default function AssignmentProgressCard({ homework }) {
  const pct = homework?.completionPercent ?? 0;
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">Submission rate</div>
      <div className="text-xl font-bold">{pct}%</div>
      <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
        <div className="h-full bg-emerald-500/80" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
