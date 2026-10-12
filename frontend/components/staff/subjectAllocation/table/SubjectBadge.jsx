"use client";
import React from "react";

export default function SubjectBadge({ subject }) {
  return <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">{subject || "—"}</span>;
}

