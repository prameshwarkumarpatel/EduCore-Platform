"use client";
import React from "react";
import AlertBadge from "./AlertBadge";

export default function AbsenteeAlertPanel({ items = [], threshold }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Absentee Alerts</div>
        <AlertBadge count={items.length} />
      </div>
      <p className="text-sm text-muted-foreground mt-1">Staff with ≥{threshold} absent days this month.</p>
      <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
        {items.length ? items.map((a) => (
          <div key={a.staffId} className="rounded-lg border border-rose-400/30 bg-rose-500/5 px-3 py-2">
            <div className="font-medium text-sm">{a.staffName}</div>
            <div className="text-xs text-muted-foreground">{a.department} · {a.absentDays} absent</div>
          </div>
        )) : (
          <div className="py-6 text-center text-sm text-emerald-600">No absentee alerts.</div>
        )}
      </div>
    </div>
  );
}
