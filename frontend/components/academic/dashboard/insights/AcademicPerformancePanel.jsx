"use client";
import React from "react";
import PerformanceChart from "./PerformanceChart";

export default function AcademicPerformancePanel({ insights }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Performance</div>
      <p className="text-sm mt-2 text-muted-foreground">{insights?.headline || "—"}</p>
      <PerformanceChart subjectPerformance={insights?.subjectPerformance} />
    </div>
  );
}
