"use client";
import React from "react";

export default function AcademicAnalyticsChart({ curriculum, homework, lesson }) {
  const bars = [
    { label: "Curriculum", value: curriculum?.percentComplete ?? 0 },
    { label: "Homework", value: homework?.completionPercent ?? 0 },
    { label: "Lessons", value: lesson?.completionRate ?? 0 },
  ];
  const max = 100;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Analytics</div>
      <div className="mt-4 space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span>{b.label}</span>
              <span className="text-muted-foreground">{b.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary/70" style={{ width: `${(b.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
