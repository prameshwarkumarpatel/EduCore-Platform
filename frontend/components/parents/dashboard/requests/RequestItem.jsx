"use client";
import React from "react";

export default function RequestItem({ item }) {
  if (!item) return null;
  return (
    <div className="rounded-xl border bg-background/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {item.parent?.name || "Parent"} → {item.student?.name || "Student"}
          </div>
          <div className="text-[12px] text-muted-foreground mt-1 truncate">
            {item.channel || "SMS"} · {item.severity ? item.severity.toUpperCase() : "LOW"} · Pending
          </div>
        </div>
        <div className="shrink-0 text-[11px] rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-amber-200">
          Action needed
        </div>
      </div>
      <div className="text-sm text-foreground mt-2 line-clamp-2">{item.message || "—"}</div>
      <div className="text-[11px] text-muted-foreground mt-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}</div>
    </div>
  );
}

