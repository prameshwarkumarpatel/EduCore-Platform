"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function ParentStatusBadge({ status }) {
  const s = status || "Active";
  const cls =
    s === "Active"
      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
      : "bg-rose-500/15 border-rose-400/30 text-rose-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cls
      )}
    >
      {s}
    </span>
  );
}
