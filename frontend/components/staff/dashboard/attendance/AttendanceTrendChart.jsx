"use client";
import React from "react";

export default function AttendanceTrendChart({ trend = [] }) {
  const max = Math.max(...trend.map((t) => t.present || 0), 1);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-orange-100/80">Attendance Trend</div>
      <div className="mt-4 grid grid-cols-7 gap-2 items-end h-24">
        {trend.slice(-7).map((d) => (
          <div key={d.date} className="flex flex-col items-center gap-1">
            <div className="w-full rounded bg-orange-400/80" style={{ height: `${Math.max(8, Math.round(((d.present || 0) / max) * 90))}%` }} />
            <div className="text-[10px] text-muted-foreground">{String(d.date).slice(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

