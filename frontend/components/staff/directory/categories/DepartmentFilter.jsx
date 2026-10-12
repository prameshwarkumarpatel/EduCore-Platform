"use client";
import React from "react";

export default function DepartmentFilter({ departments = [], value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm">
      <option value="">All Departments</option>
      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
    </select>
  );
}

