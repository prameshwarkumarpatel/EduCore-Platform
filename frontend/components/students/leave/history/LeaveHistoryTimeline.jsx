"use client";
import React from "react";
import HistoryItem from "./HistoryItem";

export default function LeaveHistoryTimeline({ items = [] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Leave History</div>
          <div className="text-sm font-semibold text-foreground mt-1">{list.length} records</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {list.length ? (
          list.map((it) => <HistoryItem key={it.id} item={it} />)
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No leave history found.
          </div>
        )}
      </div>
    </div>
  );
}

