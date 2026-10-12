"use client";
import React from "react";

export default function CurriculumProgressCard({ curriculum }) {
  const pct = curriculum?.percentComplete ?? 0;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Curriculum</div>
      <div className="mt-2 text-2xl font-bold">{pct}%</div>
      <div className="text-sm text-muted-foreground">
        {curriculum?.completedUnits ?? 0} / {curriculum?.totalUnits ?? 0} units complete
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
