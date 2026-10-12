"use client";
import React from "react";
import AlertItem from "./AlertItem";

export default function LowAttendanceAlertPanel({ items = [], threshold }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Low Attendance Alerts</div>
          <div className="text-sm font-semibold text-foreground mt-1">Intervention recommended</div>
        </div>
        <div className="text-xs text-muted-foreground">Threshold: {threshold ?? 75}%</div>
      </div>

      <div className="space-y-3">
        {items.length ? (
          items.map((it) => <AlertItem key={it.id} item={it} />)
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No low-attendance cases for selected filters/range.
          </div>
        )}
      </div>
    </div>
  );
}

