"use client";
import React, { useMemo } from "react";
import { Layers } from "lucide-react";

export default function GradeDistributionCard({ grades }) {
  const rows = Array.isArray(grades) ? grades : [];
  const max = useMemo(() => Math.max(1, ...rows.map((r) => r.total || 0)), [rows]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Students by Grade</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <Layers className="h-4 w-4 text-emerald-300" />
        </div>
      </div>

      <div className="space-y-2">
        {rows.slice(0, 8).map((r) => (
          <div key={r.grade} className="flex items-center gap-3">
            <div className="w-28 text-xs font-semibold text-foreground truncate">{r.grade}</div>
            <div className="flex-1 h-2 rounded-full bg-background/40 border border-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400/70"
                style={{ width: `${Math.round(((r.total || 0) / max) * 100)}%` }}
              />
            </div>
            <div className="w-10 text-right text-xs font-bold text-foreground">{r.total || 0}</div>
          </div>
        ))}
        {!rows.length ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No grade distribution yet. Convert applications to enroll students.
          </div>
        ) : null}
      </div>
    </div>
  );
}

