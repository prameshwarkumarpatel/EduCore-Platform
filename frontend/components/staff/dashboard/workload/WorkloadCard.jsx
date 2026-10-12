"use client";
import React from "react";

export default function WorkloadCard({ item }) {
  if (!item) return null;
  return (
    <div className="rounded-xl border bg-card/50 p-3">
      <div className="font-semibold">{item.name}</div>
      <div className="text-xs text-muted-foreground">{item.department}</div>
      <div className="mt-2 text-xs">
        Classes: <span className="font-semibold">{item.classesCount}</span> · Subjects: <span className="font-semibold">{item.subjectsCount}</span>
      </div>
    </div>
  );
}

