"use client";
import React from "react";

export default function DepartmentDistributionCard({ items = [] }) {
  const max = Math.max(...items.map((x) => x.count || 0), 1);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-emerald-100/80">Department Distribution</div>
      <div className="mt-4 space-y-2">
        {items.length ? items.map((d) => (
          <div key={d.department}>
            <div className="flex justify-between text-xs"><span>{d.department || "N/A"}</span><span>{d.count || 0}</span></div>
            <div className="h-2 rounded-full bg-muted/40 mt-1">
              <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.round(((d.count || 0) / max) * 100)}%` }} />
            </div>
          </div>
        )) : <div className="text-sm text-muted-foreground">No department data.</div>}
      </div>
    </div>
  );
}

