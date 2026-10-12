"use client";
import React from "react";

export default function RemarksInput({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      placeholder="Add verification remarks (reason, note, missing items)..."
    />
  );
}

