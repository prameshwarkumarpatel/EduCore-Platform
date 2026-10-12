"use client";
import React, { useMemo } from "react";

function bucketLabel(min, max) {
  if (max == null) return `${min}+`;
  return `${min}-${max}`;
}

export default function ParentStudentChart({ linkedStudents = [] }) {
  const list = useMemo(() => (Array.isArray(linkedStudents) ? linkedStudents : []), [linkedStudents]);

  const buckets = useMemo(() => {
    const base = [
      { key: "1-2", label: bucketLabel(1, 2), count: 0 },
      { key: "3-4", label: bucketLabel(3, 4), count: 0 },
      { key: "5", label: bucketLabel(5, 5), count: 0 },
      { key: "6+", label: bucketLabel(6, null), count: 0 },
    ];

    for (const p of list) {
      const c = Number(p.studentsCount) || 0;
      if (c >= 6) base[3].count += 1;
      else if (c >= 5) base[2].count += 1;
      else if (c >= 3) base[1].count += 1;
      else if (c >= 1) base[0].count += 1;
      else {
        // ignore 0 children in the visual
      }
    }
    return base;
  }, [list]);

  const max = useMemo(() => Math.max(1, ...buckets.map((b) => b.count)), [buckets]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Parent Distribution</div>
          <div className="text-sm font-semibold text-foreground mt-1">Children per parent</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2 text-xs text-muted-foreground">
          {list.length} parents
        </div>
      </div>

      <div className="space-y-3">
        {buckets.map((b) => {
          const pct = (b.count / max) * 100;
          return (
            <div key={b.key} className="flex items-center gap-3">
              <div className="w-16 text-[11px] text-muted-foreground">{b.label}</div>
              <div className="flex-1 h-3 rounded-full border bg-background/40 overflow-hidden">
                <div className="h-full bg-teal-400/80" style={{ width: `${Math.max(2, Math.round(pct))}%` }} />
              </div>
              <div className="w-10 text-right text-[11px] text-foreground font-semibold">{b.count}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-[12px] text-muted-foreground">
        Visual analytics help spot parent groups with more linked students.
      </div>
    </div>
  );
}

