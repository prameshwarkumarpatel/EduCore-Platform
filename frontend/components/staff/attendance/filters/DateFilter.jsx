"use client";
import React from "react";

export default function DateFilter({ value, onChange }) {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
    />
  );
}
