"use client";
import React from "react";
import ErrorMessage from "../validation/ErrorMessage";

export default function DepartmentSelector({ departments = [], value, onChange, error }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-amber-100/80">Department Assignment</div>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Select Department</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <ErrorMessage message={error} />
    </div>
  );
}

