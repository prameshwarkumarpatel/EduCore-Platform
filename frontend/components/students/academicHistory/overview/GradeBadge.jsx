"use client";
import React from "react";

export default function GradeBadge({ grade }) {
  const g = (grade || "C").toUpperCase();
  const cls =
    g === "A"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : g === "B"
        ? "bg-sky-500/15 text-sky-300 border-sky-400/20"
        : g === "C"
          ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
          : g === "D"
            ? "bg-orange-500/15 text-orange-300 border-orange-400/20"
            : "bg-rose-500/15 text-rose-300 border-rose-400/20";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {g}
    </span>
  );
}

