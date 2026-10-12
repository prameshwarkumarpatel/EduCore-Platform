"use client";
import React from "react";

export default function InsightsCard({ stats, attendance }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-slate-500/15 to-gray-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Insights</div>
      <ul className="mt-3 space-y-2 text-sm">
        <li>Teacher ratio: <span className="font-semibold">{Math.round((stats?.teacherRatio || 0) * 100)}%</span></li>
        <li>Attendance present: <span className="font-semibold">{attendance?.presentPercent || 0}%</span></li>
        <li>Total staff: <span className="font-semibold">{stats?.totalStaff || 0}</span></li>
      </ul>
    </div>
  );
}

