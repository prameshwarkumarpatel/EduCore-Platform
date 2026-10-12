"use client";
import React, { useMemo } from "react";
import { PieChart } from "lucide-react";

export default function SectionDistributionChart({ gradeDistribution }) {
  const rows = Array.isArray(gradeDistribution) ? gradeDistribution : [];
  const sections = useMemo(() => {
    const map = new Map();
    for (const g of rows) {
      const secs = g.sections || {};
      Object.entries(secs).forEach(([sec, count]) => {
        map.set(sec, (map.get(sec) || 0) + (count || 0));
      });
    }
    return Array.from(map.entries())
      .map(([section, total]) => ({ section, total }))
      .sort((a, b) => b.total - a.total);
  }, [rows]);

  const max = useMemo(() => Math.max(1, ...sections.map((s) => s.total)), [sections]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Section Distribution</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <PieChart className="h-4 w-4 text-teal-300" />
        </div>
      </div>

      <div className="space-y-2">
        {sections.slice(0, 6).map((s) => (
          <div key={s.section} className="flex items-center gap-3">
            <div className="w-12 text-xs font-semibold text-foreground">{s.section}</div>
            <div className="flex-1 h-2 rounded-full bg-background/40 border border-border/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-400/70"
                style={{ width: `${Math.round((s.total / max) * 100)}%` }}
              />
            </div>
            <div className="w-10 text-right text-xs font-bold text-foreground">{s.total}</div>
          </div>
        ))}
        {!sections.length ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No section distribution yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

