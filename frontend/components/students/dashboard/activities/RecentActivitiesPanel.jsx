"use client";
import React from "react";
import ActivityTimeline from "./ActivityTimeline";
import { Clock } from "lucide-react";

export default function RecentActivitiesPanel({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Recent Student Activities</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <Clock className="h-4 w-4 text-amber-300" />
        </div>
      </div>
      {list.length ? (
        <ActivityTimeline items={list} />
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No recent activity in this range.
        </div>
      )}
    </div>
  );
}

