"use client";
import React from "react";
import EnrollmentRow from "./EnrollmentRow";

export default function EnrollmentTable({ rows, selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Enrolled Students</div>
        <div className="text-xs text-muted-foreground">{rows?.length || 0} records</div>
      </div>

      <div className="space-y-3">
        {rows?.length ? (
          rows.map((r) => (
            <EnrollmentRow key={r.id} row={r} selected={r.id === selectedId} onSelect={onSelect} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground bg-background/30">
            No enrollment records found. Convert an approved application to create a student record.
          </div>
        )}
      </div>
    </div>
  );
}

