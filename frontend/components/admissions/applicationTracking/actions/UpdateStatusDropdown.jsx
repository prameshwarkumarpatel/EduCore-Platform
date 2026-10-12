"use client";
import React from "react";

export default function UpdateStatusDropdown({ status, onChange, disabled }) {
  return (
    <select
      disabled={disabled}
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60"
    >
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>
  );
}

