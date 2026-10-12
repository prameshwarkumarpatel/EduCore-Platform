"use client";
import React from "react";
import ActivityItem from "./ActivityItem";

export default function RecentActivitiesList({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-rose-500/15 to-red-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-rose-100/80">Recent Activities</div>
      <div className="mt-3 space-y-2">
        {items.slice(0, 7).map((i) => <ActivityItem key={i.id} item={i} />)}
      </div>
    </div>
  );
}

