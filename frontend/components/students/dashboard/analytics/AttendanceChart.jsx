"use client";
import React, { useMemo } from "react";
import { LineChart } from "lucide-react";

export default function AttendanceChart({ averagePct, trend }) {
  const points = Array.isArray(trend) ? trend.slice(-14) : [];
  const max = useMemo(() => Math.max(1, ...points.map((p) => p.pct || 0)), [points]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Attendance Overview</div>
          <div className="mt-1 text-2xl font-extrabold text-foreground">{averagePct ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Average attendance in selected range</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <LineChart className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>

      <div className="h-24 flex items-end gap-1">
        {points.length ? (
          points.map((p) => (
            <div key={p.date} className="flex-1">
              <div
                className="w-full rounded-t-md bg-fuchsia-400/70"
                style={{ height: `${Math.max(2, Math.round(((p.pct || 0) / max) * 100))}%` }}
                title={`${p.date}: ${p.pct}%`}
              />
            </div>
          ))
        ) : (
          <div className="w-full rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No attendance data yet.
          </div>
        )}
      </div>
    </div>
  );
}

