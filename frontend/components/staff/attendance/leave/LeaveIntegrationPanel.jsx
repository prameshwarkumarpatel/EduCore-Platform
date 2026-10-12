"use client";
import React from "react";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function LeaveIntegrationPanel({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Leave Integration</div>
      <p className="text-sm text-muted-foreground mt-1">Approved staff leave records (synced with attendance).</p>
      <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
        {items.length ? items.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg border bg-card/40 px-3 py-2">
            <div>
              <div className="font-medium text-sm">{l.staffName}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                {l.reason ? ` · ${l.reason}` : ""}
              </div>
            </div>
            <LeaveStatusBadge status={l.status} />
          </div>
        )) : (
          <div className="py-6 text-center text-sm text-muted-foreground">No leave records in selected range.</div>
        )}
      </div>
    </div>
  );
}
