"use client";
import React from "react";

export default function HoursProgressBar({ value = 0 }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${value >= 100 ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

