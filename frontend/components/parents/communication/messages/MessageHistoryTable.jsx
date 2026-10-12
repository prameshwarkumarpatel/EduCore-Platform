"use client";
import React from "react";
import MessageRow from "./MessageRow";

export default function MessageHistoryTable({ items, channelFilter }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 via-sky-500/15 to-indigo-500/10 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-blue-100/90">Message History</div>
          <div className="mt-1 text-sm text-blue-100/70">
            {channelFilter ? `Filtered: ${channelFilter}` : "All channels"}
          </div>
        </div>
        <div className="text-xs text-blue-100/70">{list.length} records</div>
      </div>

      <div className="mt-4 space-y-2">
        {list.length ? (
          list.map((m) => <MessageRow key={m.id} item={m} />)
        ) : (
          <div className="rounded-xl border border-dashed bg-background/30 p-6 text-center text-sm text-muted-foreground">
            No messages found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

