"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function StudentFilter({ students = [], selectedId, onSelect, search, onSearch }) {
  return (
    <div className="space-y-2">
      <Input value={search || ""} onChange={(e) => onSearch?.(e.target.value)} placeholder="Search student..." className="h-9 text-xs" />
      <select
        value={selectedId || ""}
        onChange={(e) => onSelect?.(e.target.value || "")}
        className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">All Students</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.enrollmentId || "—"})
          </option>
        ))}
      </select>
    </div>
  );
}

