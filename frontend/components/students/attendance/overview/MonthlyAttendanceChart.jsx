"use client";
import React, { useMemo } from "react";

export default function MonthlyAttendanceChart({ points = [] }) {
  const max = useMemo(() => Math.max(1, ...points.map((p) => Number(p.attendedPct) || 0)), [points]);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Monthly Trend</div>
          <div className="text-sm font-semibold text-foreground mt-1">Attendance percentage</div>
        </div>
        <div className="text-xs text-muted-foreground">{points.length} months</div>
      </div>

      <div className="h-28 flex items-end gap-2 overflow-x-auto pb-1">
        {points.length ? (
          points.map((p) => {
            const v = Number(p.attendedPct) || 0;
            const pct = v / max;
            return (
              <div key={p.x} className="min-w-[42px] flex-1" title={`${p.x}: ${v}%`}>
                <div className="w-full rounded-t-md bg-teal-400/80" style={{ height: `${Math.max(6, Math.round(pct * 100))}%` }} />
              </div>
            );
          })
        ) : (
          <div className="w-full rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No monthly data.
          </div>
        )}
      </div>
    </div>
  );
}

