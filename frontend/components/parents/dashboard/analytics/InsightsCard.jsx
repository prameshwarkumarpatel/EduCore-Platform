"use client";
import React, { useMemo } from "react";

export default function InsightsCard({ stats, linkedStudents = [] }) {
  const list = useMemo(() => (Array.isArray(linkedStudents) ? linkedStudents : []), [linkedStudents]);
  const topParent = useMemo(() => {
    if (!list.length) return null;
    return list.slice().sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0))[0];
  }, [list]);

  const pending = stats?.updatesPending || 0;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Insights</div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        <div className="rounded-xl border bg-background/30 p-3">
          <div className="text-sm font-semibold text-foreground">Workload</div>
          <div className="text-muted-foreground text-sm mt-1">Pending updates to review: {pending}</div>
        </div>
        <div className="rounded-xl border bg-background/30 p-3">
          <div className="text-sm font-semibold text-foreground">Top-linked parent</div>
          <div className="text-muted-foreground text-sm mt-1">
            {topParent ? `${topParent.name} (${topParent.studentsCount} students)` : "—"}
          </div>
        </div>
        <div className="rounded-xl border bg-background/30 p-3">
          <div className="text-sm font-semibold text-foreground">Communication health</div>
          <div className="text-muted-foreground text-sm mt-1">
            Keep communication up-to-date by acting on pending requests.
          </div>
        </div>
      </div>
    </div>
  );
}

