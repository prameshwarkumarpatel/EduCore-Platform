"use client";
import React from "react";
import HoursProgressBar from "./HoursProgressBar";

export default function TeachingHoursTracker({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Teaching Hours Tracker</div>
      <div className="mt-3 space-y-2">
        {items.slice(0, 8).map((h) => (
          <div key={h.staffId} className="rounded-lg border bg-card/40 p-2">
            <div className="flex items-center justify-between text-xs">
              <span>{h.staffName}</span>
              <span>{h.teachingHours}h / {h.targetHours}h</span>
            </div>
            <HoursProgressBar value={h.progressPercent} />
          </div>
        ))}
      </div>
    </div>
  );
}

