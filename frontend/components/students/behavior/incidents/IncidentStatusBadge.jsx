"use client";
import React from "react";

export default function IncidentStatusBadge({ severity }) {
  const s = severity || "low";
  const cls =
    s === "critical"
      ? "bg-rose-500/15 text-rose-300 border-rose-400/20"
      : s === "high"
        ? "bg-orange-500/15 text-orange-300 border-orange-400/20"
        : s === "medium"
          ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
          : "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {s.toUpperCase()}
    </span>
  );
}

