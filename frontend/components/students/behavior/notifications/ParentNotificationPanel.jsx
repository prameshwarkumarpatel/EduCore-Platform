"use client";
import React from "react";
import SendNotificationButton from "./SendNotificationButton";

export default function ParentNotificationPanel({ studentId, incidentId, notifications = [], onSent }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 shadow-sm space-y-4">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Parent Notification</div>
        <div className="text-sm font-semibold text-foreground mt-1">Notify guardians about incidents</div>
      </div>

      <SendNotificationButton studentId={studentId} incidentId={incidentId} onSent={onSent} />

      <div className="space-y-2">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Recent notifications</div>
        {notifications.length ? (
          <div className="space-y-2">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="text-sm font-semibold text-foreground">{n.status}</div>
                <div className="text-xs text-muted-foreground mt-1">{n.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}

