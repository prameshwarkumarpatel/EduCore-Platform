"use client";
import React from "react";

export default function AttendanceStatusBadge({ status }) {
  const s = status || "Unmarked";
  const cls =
    s === "Present"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : s === "Late"
        ? "bg-sky-500/15 text-sky-300 border-sky-400/20"
        : s === "Absent"
          ? "bg-rose-500/15 text-rose-300 border-rose-400/20"
          : "bg-muted text-muted-foreground/90 border-border/60";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {s}
    </span>
  );
}

