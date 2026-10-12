"use client";
import React, { useMemo } from "react";

export default function WeeklyAttendanceChart({ points = [] }) {
  const max = useMemo(() => Math.max(1, ...points.map((p) => Number(p.attendedPct) || 0)), [points]);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Weekly Trend</div>
          <div className="text-sm font-semibold text-foreground mt-1">Attendance percentage</div>
        </div>
        <div className="text-xs text-muted-foreground">{points.length} weeks</div>
      </div>

      <div className="h-28 flex items-end gap-2">
        {points.length ? (
          points.map((p) => {
            const v = Number(p.attendedPct) || 0;
            const pct = v / max;
            return (
              <div key={p.x} className="flex-1" title={`${p.x}: ${v}%`}>
                <div className="w-full rounded-t-md bg-indigo-400/80" style={{ height: `${Math.max(6, Math.round(pct * 100))}%` }} />
              </div>
            );
          })
        ) : (
          <div className="w-full rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No weekly data.
          </div>
        )}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
        {points.slice(0, 6).map((p) => (
          <span key={p.x} className="truncate max-w-[25%]">
            {p.x}
          </span>
        ))}
      </div>
    </div>
  );
}

