"use client";
import React from "react";
import AssignmentProgressCard from "./AssignmentProgressCard";

export default function HomeworkStatusPanel({ homework }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Homework & Assignments</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div>
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-lg font-semibold">{homework?.totalAssignments ?? 0}</div>
          <div className="text-xs text-muted-foreground">With pending submissions: {homework?.pendingAssignments ?? 0}</div>
        </div>
        <AssignmentProgressCard homework={homework} />
      </div>
      <div className="mt-3 space-y-1 max-h-36 overflow-y-auto text-xs">
        {(homework?.items || []).slice(0, 6).map((a) => (
          <div key={a.id} className="flex justify-between gap-2 border-b border-border/40 pb-1">
            <span className="truncate">{a.title}</span>
            <span className="shrink-0 text-muted-foreground">{a.submittedCount}/{a.totalStudents}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
