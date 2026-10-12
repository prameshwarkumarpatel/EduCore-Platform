"use client";
import React from "react";

const STATUSES = ["Present", "Absent", "Late", "Leave"];

export default function AttendanceToggle({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            (value || "Present") === s
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
