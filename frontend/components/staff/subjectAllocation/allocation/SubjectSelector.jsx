"use client";
import React from "react";

export default function SubjectSelector({ subjects = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
      <option value="">Select Subject</option>
      {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  );
}

