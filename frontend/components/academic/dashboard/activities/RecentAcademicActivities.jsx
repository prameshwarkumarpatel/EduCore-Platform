"use client";
import React from "react";
import ActivityItem from "./ActivityItem";

export default function RecentAcademicActivities({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Recent Activities</div>
      <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
        {items.length ? items.map((a) => <ActivityItem key={a.id} item={a} />) : (
          <div className="text-sm text-muted-foreground py-4 text-center">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
