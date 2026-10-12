"use client";
import React from "react";

export default function YearRecordCard({ record }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            {record?.academicYear || "Year"}
          </div>
          <div className="mt-1 text-sm font-bold text-foreground truncate">{record?.term || "Term"}</div>
          <div className="text-xs text-muted-foreground mt-1">Created: {record?.createdAt ? new Date(record.createdAt).toLocaleDateString() : "—"}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2 text-center min-w-[90px]">
          <div className="text-lg font-extrabold text-foreground">{record?.gpa ?? 0}</div>
          <div className="text-[11px] text-muted-foreground">GPA</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Top Subjects</div>
        <div className="space-y-2">
          {(record?.subjects || []).slice(0, 4).map((s) => (
            <div key={s.subject} className="flex items-center justify-between gap-3 text-sm">
              <div className="truncate text-muted-foreground">{s.subject}</div>
              <div className="font-semibold text-foreground">
                {s.marks} <span className="text-xs text-muted-foreground">({s.grade})</span>
              </div>
            </div>
          ))}
          {!record?.subjects?.length ? (
            <div className="text-sm text-muted-foreground">No subjects recorded.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

