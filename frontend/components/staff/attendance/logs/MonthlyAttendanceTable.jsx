"use client";
import React from "react";

function PercentBadge({ pct }) {
  const ok = pct >= 80;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${ok ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}>
      {pct}%
    </span>
  );
}

export default function MonthlyAttendanceTable({ items = [], month, year }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Monthly Overview</div>
      <p className="text-sm text-muted-foreground mt-1">{year}-{String(month).padStart(2, "0")}</p>
      <div className="mt-3 space-y-2 max-h-[320px] overflow-y-auto">
        {items.length ? items.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border bg-card/40 px-3 py-2">
            <div>
              <div className="font-medium text-sm">{r.staffName}</div>
              <div className="text-xs text-muted-foreground">{r.department} · P:{r.present} A:{r.absent} L:{r.late} Leave:{r.leave}</div>
            </div>
            <PercentBadge pct={r.attendancePercent} />
          </div>
        )) : (
          <div className="py-8 text-center text-sm text-muted-foreground">No records for this month.</div>
        )}
      </div>
    </div>
  );
}
