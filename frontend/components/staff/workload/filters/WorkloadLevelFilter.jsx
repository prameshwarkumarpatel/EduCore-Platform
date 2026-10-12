"use client";
import React from "react";

export default function WorkloadLevelFilter({ levels = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
      <option value="">All Workload Levels</option>
      {levels.map((l) => <option key={l} value={l}>{l}</option>)}
    </select>
  );
}

