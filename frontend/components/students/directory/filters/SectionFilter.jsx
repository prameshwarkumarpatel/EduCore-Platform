"use client";
import React from "react";

export default function SectionFilter({ options, value, onChange, disabled }) {
  const list = Array.isArray(options) ? options : [];
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
    >
      <option value="">All sections</option>
      {list.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

