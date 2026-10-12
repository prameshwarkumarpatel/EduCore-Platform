"use client";
import React from "react";

export default function DocumentTypeFilter({ value, onChange, options }) {
  const list = options && options.length ? options : ["ID Proof", "Birth Certificate", "Previous Marksheet"];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="">All types</option>
      {list.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}

