"use client";
import React from "react";

export default function StaffRatioCard({ teachers = 0, nonTeaching = 0 }) {
  const total = teachers + nonTeaching || 1;
  const tPct = Math.round((teachers / total) * 100);
  const nPct = 100 - tPct;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/15 to-cyan-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-sky-100/80">Teacher vs Non-Teaching</div>
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs"><span>Teachers</span><span>{teachers}</span></div>
          <div className="h-2 rounded-full bg-muted/40 mt-1"><div className="h-2 rounded-full bg-sky-400" style={{ width: `${tPct}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs"><span>Non-Teaching</span><span>{nonTeaching}</span></div>
          <div className="h-2 rounded-full bg-muted/40 mt-1"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${nPct}%` }} /></div>
        </div>
      </div>
    </div>
  );
}

