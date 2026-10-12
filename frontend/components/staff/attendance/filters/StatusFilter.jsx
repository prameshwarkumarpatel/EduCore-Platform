"use client";
import React from "react";

export default function StatusFilter({ statuses = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
      <option value="">All Statuses</option>
      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
