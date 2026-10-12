"use client";
import React from "react";

export default function SubjectFilter({ subjects = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
      <option value="">All Subjects</option>
      {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
}

