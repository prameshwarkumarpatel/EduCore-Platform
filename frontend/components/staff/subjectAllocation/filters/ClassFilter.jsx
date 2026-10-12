"use client";
import React from "react";

export default function ClassFilter({ classes = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
      <option value="">All Classes</option>
      {classes.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
    </select>
  );
}

