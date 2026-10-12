"use client";
import React from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityTimeline({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="space-y-3">
      {list.map((i) => (
        <ActivityItem key={i.id} item={i} />
      ))}
    </div>
  );
}

