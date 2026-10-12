"use client";
import React from "react";

export default function DistributionChart({ distribution }) {
  const d = distribution || { overloaded: 0, balanced: 0, underloaded: 0 };
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Workload Distribution</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Overloaded <span className="text-rose-500 font-semibold">{d.overloaded}</span> ·
        Balanced <span className="text-emerald-500 font-semibold">{d.balanced}</span> ·
        Underloaded <span className="text-amber-500 font-semibold">{d.underloaded}</span>
      </div>
    </div>
  );
}

