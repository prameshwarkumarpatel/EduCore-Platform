"use client";
import React from "react";

export default function SubjectsCard({ overview }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Subjects</div>
      <div className="mt-2 text-2xl font-bold">{overview?.totalSubjects ?? 0}</div>
      <div className="text-sm text-muted-foreground">Subjects offered</div>
    </div>
  );
}
