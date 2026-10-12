"use client";
import React from "react";

export default function FilterPanel({ status, onStatusChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">Status:</span>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
      >
        <option value="">All</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
