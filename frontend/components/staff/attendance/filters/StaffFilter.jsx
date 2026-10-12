"use client";
import React from "react";

export default function StaffFilter({ staff = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
      <option value="">All Staff</option>
      {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
}
