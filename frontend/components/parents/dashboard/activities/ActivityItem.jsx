"use client";
import React from "react";

export default function ActivityItem({ item }) {
  if (!item) return null;
  const type = item.type || "Update";
  const channel = item.channel || "SMS";
  const status = item.status || "Sent";

  const badge =
    item.severity === "high"
      ? "bg-rose-500/15 border-rose-400/30 text-rose-200"
      : item.severity === "medium"
      ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
      : "bg-emerald-500/15 border-emerald-400/30 text-emerald-200";

  return (
    <div className="rounded-xl border bg-background/30 p-3 hover:bg-muted/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{item.parent?.name || "Parent"} · {item.student?.name || "Student"}</div>
          <div className="text-[12px] text-muted-foreground mt-1 truncate">
            {type} via {channel} · {item.direction || "Outgoing"} · {status}
          </div>
        </div>
        <div className={`shrink-0 text-[11px] border px-2 py-1 rounded-full ${badge}`}>
          {item.severity ? item.severity.toUpperCase() : "LOW"}
        </div>
      </div>
      <div className="text-sm text-foreground mt-2 line-clamp-2">{item.message || "—"}</div>
      <div className="text-[11px] text-muted-foreground mt-2">
        {item.sentAt ? new Date(item.sentAt).toLocaleString() : new Date(item.createdAt).toLocaleString()}
      </div>
    </div>
  );
}

