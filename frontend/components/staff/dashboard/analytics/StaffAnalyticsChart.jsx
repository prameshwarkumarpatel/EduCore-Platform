"use client";
import React from "react";

export default function StaffAnalyticsChart({ stats }) {
  const teachers = stats?.teachers || 0;
  const nonTeaching = stats?.nonTeaching || 0;
  const max = Math.max(teachers, nonTeaching, 1);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-slate-500/10 to-zinc-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Analytics</div>
      <div className="mt-4 grid grid-cols-2 gap-3 items-end h-28">
        <div>
          <div className="text-xs mb-1">Teachers</div>
          <div className="rounded bg-indigo-400 h-16" style={{ height: `${Math.round((teachers / max) * 100)}%` }} />
        </div>
        <div>
          <div className="text-xs mb-1">Non-Teaching</div>
          <div className="rounded bg-emerald-400 h-16" style={{ height: `${Math.round((nonTeaching / max) * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

