"use client";
import React from "react";

export default function WorkloadCard({ item }) {
  return (
    <div className="rounded-lg border bg-card/40 px-3 py-2 text-sm">
      <div className="font-semibold">{item.teacherName}</div>
      <div className="text-xs text-muted-foreground">Subjects {item.subjectsCount} · Classes {item.classesCount}</div>
      <div className={`text-xs mt-1 ${item.overloaded ? "text-rose-300" : "text-emerald-300"}`}>{item.overloaded ? "Overloaded" : "Balanced"}</div>
    </div>
  );
}

