"use client";
import React from "react";
import GradeBadge from "./GradeBadge";

export default function GradesSummaryCard({ latest }) {
  const subjects = latest?.subjects || [];
  const dist = latest?.gradeDistribution || {};

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Latest Grades</div>
          <div className="mt-1 text-sm font-bold">
            {latest?.academicYear || "—"} • {latest?.term || "—"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">GPA: {latest?.gpa ?? 0}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2 text-xs text-muted-foreground text-center">
          <div className="font-bold text-foreground">{subjects.length}</div>
          <div>subjects</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {["A", "B", "C"].map((g) => (
          <div key={g} className="rounded-xl border border-border/60 bg-background/40 p-2">
            <div className="flex items-center justify-between">
              <GradeBadge grade={g} />
              <div className="text-xs font-bold text-foreground">{dist[g] ?? 0}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {subjects.slice(0, 8).map((s) => (
          <div key={s.subject} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-2">
            <div className="min-w-0">
              <div className="text-xs font-bold text-foreground truncate">{s.subject}</div>
              <div className="text-[11px] text-muted-foreground">Marks: {s.marks}</div>
            </div>
            <GradeBadge grade={s.grade} />
          </div>
        ))}
        {!subjects.length ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No grades found.
          </div>
        ) : null}
      </div>
    </div>
  );
}

