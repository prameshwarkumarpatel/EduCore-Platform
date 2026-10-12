"use client";
import React from "react";
import WorkloadCard from "./WorkloadCard";

export default function WorkloadSummaryPanel({ data }) {
  const items = data?.items || [];
  const summary = data?.summary || { totalClasses: 0, totalSubjects: 0 };
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-violet-100/80">Workload Summary</div>
        <div className="text-xs text-violet-100/70">Classes {summary.totalClasses} · Subjects {summary.totalSubjects}</div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.slice(0, 6).map((i) => <WorkloadCard key={i.id} item={i} />)}
      </div>
    </div>
  );
}

