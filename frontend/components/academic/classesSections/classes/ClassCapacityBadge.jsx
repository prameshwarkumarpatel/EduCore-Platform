"use client";
import React from "react";

export default function ClassCapacityBadge({ studentCount = 0, sectionsCount = 0 }) {
  const avg = sectionsCount ? Math.round(studentCount / sectionsCount) : 0;
  return <span className="text-xs rounded-full bg-blue-500/15 text-blue-700 px-2 py-1">{studentCount} students • avg {avg}/section</span>;
}
