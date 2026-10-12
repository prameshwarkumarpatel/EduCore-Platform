"use client";
import React from "react";

export default function TeacherSelector({ teachers = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
      <option value="">Select Teacher</option>
      {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  );
}

