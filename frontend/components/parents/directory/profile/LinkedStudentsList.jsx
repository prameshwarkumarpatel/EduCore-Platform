"use client";
import React from "react";

export default function LinkedStudentsList({ students }) {
  const list = Array.isArray(students) ? students : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
          Linked Students
        </div>
        <div className="text-xs text-muted-foreground">{list.length} children</div>
      </div>

      {list.length ? (
        <div className="space-y-2">
          {list.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border/40 bg-background/30 px-3 py-2 flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">{s.name || "—"}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {s.enrollmentId || ""} · {s.assignedClass || ""} {s.assignedSection ? `/ ${s.assignedSection}` : ""}
                </div>
              </div>
              <span className="shrink-0 text-[11px] rounded-full border px-2 py-0.5 bg-muted/30 text-muted-foreground">
                {s.status || "Active"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No linked students.
        </div>
      )}
    </div>
  );
}
