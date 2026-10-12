"use client";
import React from "react";
import LeaveStatusBadge from "../requests/LeaveStatusBadge";

export default function HistoryItem({ item }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-foreground truncate">{item.reason}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {item.startDate ? new Date(item.startDate).toLocaleDateString() : "—"} →{" "}
            {item.endDate ? new Date(item.endDate).toLocaleDateString() : "—"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Requested: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</div>
        </div>
        <LeaveStatusBadge status={item.status} />
      </div>
      {item.decisionNotes ? <div className="text-xs text-muted-foreground mt-3">{item.decisionNotes}</div> : null}
    </div>
  );
}

