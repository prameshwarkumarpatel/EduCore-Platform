"use client";
import React from "react";

function StatusBadge({ status }) {
  const map = {
    Present: "bg-emerald-500/15 text-emerald-600 border-emerald-400/40",
    Absent: "bg-rose-500/15 text-rose-600 border-rose-400/40",
    Late: "bg-amber-500/15 text-amber-600 border-amber-400/40",
    Leave: "bg-blue-500/15 text-blue-600 border-blue-400/40",
    Unmarked: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${map[status] || map.Unmarked}`}>
      {status}
    </span>
  );
}

export default function AttendanceRow({ row }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card/40 px-3 py-2">
      <div>
        <div className="font-medium text-sm">{row.staffName}</div>
        <div className="text-xs text-muted-foreground">{row.department}</div>
      </div>
      <StatusBadge status={row.status} />
    </div>
  );
}
