"use client";
import React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = ["Father", "Mother", "Guardian"];

export default function RelationshipSelector({ value, onChange, compact }) {
  return (
    <select
      value={value || "Guardian"}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "rounded-md border border-input bg-background px-2 text-xs font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        compact ? "py-1" : "py-2"
      )}
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
