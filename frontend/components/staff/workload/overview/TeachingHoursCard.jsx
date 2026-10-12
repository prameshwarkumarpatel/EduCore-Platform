"use client";
import React from "react";

export default function TeachingHoursCard({ totalHours, avgHours }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Teaching Hours</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Total <span className="font-semibold text-foreground">{totalHours || 0}</span>h ·
        Avg <span className="font-semibold text-foreground">{avgHours || 0}</span>h/teacher
      </div>
    </div>
  );
}

