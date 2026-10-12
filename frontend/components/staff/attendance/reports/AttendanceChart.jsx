"use client";
import React from "react";

export default function AttendanceChart({ monthlyItems = [] }) {
  const present = monthlyItems.reduce((s, r) => s + (r.present || 0), 0);
  const total = monthlyItems.reduce((s, r) => s + (r.total || 0), 0);
  const pct = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Attendance Trend</div>
      <p className="text-sm text-muted-foreground mt-1">Monthly present rate</p>
      <div className="mt-3 flex items-end gap-1 h-24">
        {monthlyItems.slice(0, 10).map((r, i) => {
          const barPct = r.total ? (r.present / r.total) * 100 : 0;
          return (
            <div
              key={r.id || i}
              className="flex-1 min-w-[4px] rounded-t bg-primary/60"
              style={{ height: `${Math.max(8, barPct)}%` }}
              title={`${r.staffName}: ${r.attendancePercent}%`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-sm font-semibold">Overall: {pct}% present</p>
    </div>
  );
}
