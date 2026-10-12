"use client";
import React from "react";
import LessonProgressChart from "./LessonProgressChart";

export default function LessonPlanningPanel({ data }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Lesson Planning</div>
      <p className="text-sm text-muted-foreground mt-1">
        {data?.total ?? 0} plans · {data?.completionRate ?? 0}% published
      </p>
      <LessonProgressChart byStatus={data?.byStatus} />
      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto text-xs">
        {(data?.recent || []).slice(0, 5).map((p) => (
          <div key={p.id} className="flex justify-between gap-2 border-b border-border/40 pb-1">
            <span className="truncate">{p.title}</span>
            <span className="shrink-0 text-muted-foreground">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
