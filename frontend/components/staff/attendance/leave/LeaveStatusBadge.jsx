"use client";
import React from "react";

export default function LeaveStatusBadge({ status }) {
  return (
    <span className="inline-flex rounded-full border border-blue-400/40 bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-600">
      {status || "Approved"}
    </span>
  );
}
