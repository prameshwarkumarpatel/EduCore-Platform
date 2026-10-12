"use client";
import React from "react";

export default function TeacherFilter({ teachers = [], value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange?.(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
      <option value="">All Teachers</option>
      {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  );
}

