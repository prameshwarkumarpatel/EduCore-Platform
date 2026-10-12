"use client";
import React from "react";

export default function TypeFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="ALL">All (SMS/Email/App)</option>
      <option value="SMS">SMS</option>
      <option value="EMAIL">Email</option>
      <option value="APP">App</option>
    </select>
  );
}

