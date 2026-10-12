"use client";
import React from "react";
import ErrorMessage from "../validation/ErrorMessage";

export default function RoleSelector({ value, onChange, error }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-emerald-100/80">Role Assignment</div>
      <select value={value || "Teacher"} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="Teacher">Teacher</option>
        <option value="Admin">Admin</option>
        <option value="Staff">Staff</option>
      </select>
      <ErrorMessage message={error} />
    </div>
  );
}

