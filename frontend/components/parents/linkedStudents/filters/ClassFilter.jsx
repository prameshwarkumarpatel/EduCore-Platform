"use client";
import React from "react";

export default function ClassFilter({ classes, value, onChange, compact }) {
  const list = Array.isArray(classes) ? classes : [];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${compact ? "py-1" : "py-2"}`}
    >
      <option value="">All Classes</option>
      {list.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}
