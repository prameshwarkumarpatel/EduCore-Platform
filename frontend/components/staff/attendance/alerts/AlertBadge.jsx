"use client";
import React from "react";

export default function AlertBadge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex rounded-full bg-rose-500/15 text-rose-600 border border-rose-400/40 px-2 py-0.5 text-xs font-bold">
      {count}
    </span>
  );
}
