"use client";
import React from "react";
import NotifyButton from "./NotifyButton";

export default function NotificationPanel({ notifications = [], studentId, leaveRequestId, onNotify, busy }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4 shadow-sm space-y-4">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Notifications</div>
        <div className="text-sm font-semibold text-foreground mt-1">Alerts to parents / teachers</div>
      </div>

      <NotifyButton
        disabled={!studentId || !leaveRequestId || busy}
        onNotify={async (message) => onNotify?.({ studentId, leaveRequestId, message })}
      />

      <div className="space-y-2">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Recent notifications</div>
        {notifications.length ? (
          notifications.slice(0, 6).map((n) => (
            <div key={n.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="text-sm font-semibold text-foreground truncate">{n.status}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-3">{n.message}</div>
              <div className="text-[11px] text-muted-foreground mt-2">
                {n.sentAt ? new Date(n.sentAt).toLocaleDateString() : n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "—"}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}

