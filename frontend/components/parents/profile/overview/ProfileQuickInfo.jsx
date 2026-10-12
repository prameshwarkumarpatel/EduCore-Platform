"use client";
import React from "react";

export default function ProfileQuickInfo({ parent }) {
  const studentsCount = parent?.linkedStudents?.length ?? 0;
  const hasContact = !!(parent?.email || parent?.phone);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border bg-background/30 p-3">
        <div className="text-xs text-muted-foreground">Linked Students</div>
        <div className="text-xl font-bold text-foreground">{studentsCount}</div>
      </div>
      <div className="rounded-xl border bg-background/30 p-3">
        <div className="text-xs text-muted-foreground">Contact Status</div>
        <div className="text-sm font-semibold text-foreground">{hasContact ? "Available" : "—"}</div>
      </div>
    </div>
  );
}
