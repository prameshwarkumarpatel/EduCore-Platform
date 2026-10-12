"use client";
import React from "react";
import { CalendarDays } from "lucide-react";

export default function DateFilter({ date, onChange, start, end, onRangeChange }) {
  const todayISO = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          Date
        </div>
        <input
          type="date"
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={date || todayISO}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={start || ""}
          onChange={(e) => onRangeChange?.({ start: e.target.value, end })}
        />
        <input
          type="date"
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={end || ""}
          onChange={(e) => onRangeChange?.({ start, end: e.target.value })}
        />
      </div>
    </div>
  );
}

