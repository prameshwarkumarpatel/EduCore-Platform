"use client";
import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationHistoryList({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-violet-100/90">Notification History</div>
          <div className="mt-1 text-sm text-violet-100/70">Alerts and app updates</div>
        </div>
        <div className="text-xs text-violet-100/70">{list.length} records</div>
      </div>
      <div className="mt-4 space-y-2">
        {list.length ? (
          list.map((n) => <NotificationItem key={n.id} item={n} />)
        ) : (
          <div className="rounded-xl border border-dashed bg-background/30 p-6 text-center text-sm text-muted-foreground">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}

