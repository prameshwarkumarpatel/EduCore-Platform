"use client";
import React from "react";
import CallRow from "./CallRow";

export default function CallLogsTable({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-emerald-100/90">Call Logs</div>
          <div className="mt-1 text-sm text-emerald-100/70">Missed/Completed tracking</div>
        </div>
        <div className="text-xs text-emerald-100/70">{list.length} records</div>
      </div>
      <div className="mt-4 space-y-2">
        {list.length ? list.map((c) => <CallRow key={c.id} item={c} />) : (
          <div className="rounded-xl border border-dashed bg-background/30 p-6 text-center text-sm text-muted-foreground">
            No call records found.
          </div>
        )}
      </div>
    </div>
  );
}

