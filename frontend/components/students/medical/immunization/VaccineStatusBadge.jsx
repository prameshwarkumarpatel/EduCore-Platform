"use client";
import React from "react";

export default function VaccineStatusBadge({ status }) {
  const s = (status || "Pending").toString();
  const cls =
    s === "Completed"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : "bg-amber-500/15 text-amber-300 border-amber-400/20";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {s}
    </span>
  );
}

