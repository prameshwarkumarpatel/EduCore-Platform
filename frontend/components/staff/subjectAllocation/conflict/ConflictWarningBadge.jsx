"use client";
import React from "react";

export default function ConflictWarningBadge({ text }) {
  return <div className="inline-flex rounded-full border border-rose-400/40 bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-200">{text}</div>;
}

