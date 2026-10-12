"use client";
import React from "react";
import { cn } from "@/lib/utils";

const TYPE_COLORS = {
  Father: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  Mother: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Guardian: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

export default function RelationshipBadge({ type }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS.Guardian;
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        style
      )}
    >
      {type || "Guardian"}
    </span>
  );
}
