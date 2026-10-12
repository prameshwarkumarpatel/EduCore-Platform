"use client";
import React from "react";
import OverloadWarningCard from "./OverloadWarningCard";

export default function WorkloadAnalysisPanel({ analysis }) {
  const warnings = analysis?.warnings || [];
  const insights = analysis?.insights || [];
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Workload Analysis</div>
      <div className="mt-2 text-xs text-muted-foreground">{insights.join(" · ") || "No analysis yet"}</div>
      <div className="mt-3 space-y-2">
        {warnings.length ? warnings.slice(0, 6).map((w) => <OverloadWarningCard key={w.staffId} warning={w} />) : <div className="text-sm text-emerald-600">No overload warnings.</div>}
      </div>
    </div>
  );
}

