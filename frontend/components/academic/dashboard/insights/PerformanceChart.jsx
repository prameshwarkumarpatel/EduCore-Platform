"use client";
import React from "react";

export default function PerformanceChart({ subjectPerformance = [] }) {
  const max = Math.max(1, ...subjectPerformance.map((x) => x.submissionRate || 0));
  return (
    <div className="flex items-end gap-2 h-28 mt-2">
      {subjectPerformance.map((x) => (
        <div key={x.subject} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-teal-500/60"
            style={{ height: `${((x.submissionRate || 0) / max) * 100}%`, minHeight: 6 }}
            title={`${x.subject}: ${x.submissionRate}%`}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{x.subject}</span>
        </div>
      ))}
    </div>
  );
}
