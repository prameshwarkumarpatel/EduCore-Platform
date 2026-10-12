"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function EnrollmentStatusBadge({ status }) {
  const s = status || "Enrolled";
  const styles =
    s === "Enrolled"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : s === "Pending"
        ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
        : "bg-rose-500/15 text-rose-300 border-rose-400/20";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide",
        styles
      )}
    >
      {s}
    </span>
  );
}

