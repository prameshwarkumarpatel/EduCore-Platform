"use client";
import React from "react";

export default function ActivityItem({ item }) {
  return (
    <div className="rounded-lg border bg-card/40 px-3 py-2">
      <div className="text-sm font-semibold">{item?.title}</div>
      <div className="text-xs text-muted-foreground">{item?.detail}</div>
    </div>
  );
}

