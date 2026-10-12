"use client";
import React from "react";
import ActivityItem from "./ActivityItem";
import { Clock } from "lucide-react";

export default function RecentActivitiesList({ items }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Recent Parent Activities</div>
          <div className="text-sm font-semibold text-foreground mt-1">Activity timeline</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <Clock className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>

      {list.length ? (
        <div className="space-y-3">
          {list.map((x) => (
            <ActivityItem key={x.id} item={x} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No recent activity.
        </div>
      )}
    </div>
  );
}

