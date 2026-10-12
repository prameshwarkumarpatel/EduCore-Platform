"use client";
import React from "react";

export default function ClassesSectionsCard({ overview }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Classes & Sections</div>
      <div className="mt-2 text-2xl font-bold">{overview?.totalClasses ?? 0}</div>
      <div className="text-sm text-muted-foreground">Classes · {overview?.totalSections ?? 0} sections</div>
    </div>
  );
}
