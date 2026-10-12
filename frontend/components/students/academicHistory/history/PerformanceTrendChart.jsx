"use client";
import React, { useMemo } from "react";

export default function PerformanceTrendChart({ trend }) {
  const points = Array.isArray(trend) ? trend : [];
  const max = useMemo(() => Math.max(1, ...points.map((p) => Number(p.gpa) || 0)), [points]);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Performance Trends</div>
          <div className="mt-1 text-sm font-semibold text-foreground">GPA over terms</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <span className="text-xs font-black text-muted-foreground">Trend</span>
        </div>
      </div>

      <div className="h-28 flex items-end gap-2">
        {points.length ? (
          points.map((p) => {
            const pct = max ? (Number(p.gpa) || 0) / max : 0;
            const key = p.key || p.x || `${p.gpa}-gpa`;
            return (
              <div key={key} className="flex-1" title={`${key}: ${p.gpa}`}>
                <div
                  className="w-full rounded-t-md bg-amber-400/70"
                  style={{ height: `${Math.max(6, Math.round(pct * 100))}%` }}
                />
              </div>
            );
          })
        ) : (
          <div className="w-full rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No trend data yet.
          </div>
        )}
      </div>
    </div>
  );
}

