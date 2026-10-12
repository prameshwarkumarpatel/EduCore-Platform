"use client";
import React from "react";

export default function SectionFilter({ options = [], value, onChange, disabled }) {
  return (
    <select
      value={value || ""}
      disabled={Boolean(disabled)}
      onChange={(e) => onChange?.(e.target.value || "")}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60"
    >
      <option value="">All Sections</option>
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

