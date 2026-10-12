"use client";
import React from "react";

export default function StaffAttendanceCard({ data }) {
  const presentPercent = data?.presentPercent ?? 0;
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-amber-100/80">Attendance Overview</div>
      <div className="text-3xl font-bold mt-2">{presentPercent}%</div>
      <div className="text-xs text-muted-foreground mt-1">Present {data?.present || 0} · Late {data?.late || 0} · Absent {data?.absent || 0}</div>
    </div>
  );
}

