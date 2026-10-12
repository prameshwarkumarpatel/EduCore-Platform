"use client";
import React from "react";
import YearRecordCard from "./YearRecordCard";

export default function AcademicTimeline({ history }) {
  const list = Array.isArray(history) ? history : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic Timeline</div>
        <div className="text-xs text-muted-foreground">{list.length} records</div>
      </div>

      <div className="space-y-3">
        {list.length ? (
          list.map((r) => <YearRecordCard key={r.id} record={r} />)
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No academic history available.
          </div>
        )}
      </div>
    </div>
  );
}

