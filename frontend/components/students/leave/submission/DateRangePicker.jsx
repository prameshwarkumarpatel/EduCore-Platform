"use client";
import React from "react";

export default function DateRangePicker({ value, onChange }) {
  const { start, end } = value || {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input
        type="date"
        value={start || ""}
        onChange={(e) => onChange?.({ start: e.target.value, end })}
        className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <input
        type="date"
        value={end || ""}
        onChange={(e) => onChange?.({ start, end: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

