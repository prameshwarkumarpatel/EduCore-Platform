"use client";
import React from "react";

export default function StatusFilter({ options = [], value, onChange }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value || "")}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="">All Status</option>
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

