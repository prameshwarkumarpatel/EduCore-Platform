"use client";
import React from "react";

export default function StaffTypeBadge({ roleType }) {
  const isTeacher = roleType === "Teacher";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${isTeacher ? "border-blue-400/40 bg-blue-500/15 text-blue-300" : "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"}`}>
      {isTeacher ? "Teaching" : "Non-Teaching"}
    </span>
  );
}

