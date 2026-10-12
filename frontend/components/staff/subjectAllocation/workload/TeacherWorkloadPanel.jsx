"use client";
import React from "react";
import WorkloadCard from "./WorkloadCard";

export default function TeacherWorkloadPanel({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-violet-100/80">Teacher Workload</div>
      <div className="mt-3 space-y-2">
        {items.slice(0, 8).map((w) => <WorkloadCard key={w.teacherId} item={w} />)}
      </div>
    </div>
  );
}

