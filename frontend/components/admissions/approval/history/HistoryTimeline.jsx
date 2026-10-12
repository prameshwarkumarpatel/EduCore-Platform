"use client";
import React from "react";

function label(action) {
  if (action === "ASSIGN") return "Class assigned";
  if (action === "APPROVE") return "Approved";
  if (action === "REJECT") return "Rejected";
  if (action === "CONFIRM") return "Confirmation generated";
  if (action === "NOTIFY") return "Notification sent";
  return action;
}

export default function HistoryTimeline({ items }) {
  return (
    <div className="space-y-3">
      {items && items.length ? (
        items.map((h) => (
          <div key={h.id} className="flex gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-foreground">{label(h.action)}</div>
              <div className="text-[11px] text-muted-foreground">
                {new Date(h.createdAt).toLocaleString()}
              </div>
              {h.remarks ? (
                <div className="text-[11px] text-muted-foreground mt-1">{h.remarks}</div>
              ) : null}
            </div>
            {h.status ? (
              <div className="text-[11px] text-muted-foreground">{h.status}</div>
            ) : null}
          </div>
        ))
      ) : (
        <div className="text-xs text-muted-foreground">No history entries yet.</div>
      )}
    </div>
  );
}

