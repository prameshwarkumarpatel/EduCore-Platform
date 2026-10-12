"use client";
import React from "react";

export default function ReasonInput({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder || "Reason for leave"}
      className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  );
}

