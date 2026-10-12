"use client";
import React from "react";

export default function TaskItem({ item }) {
  return (
    <div className="rounded-lg border bg-card/40 px-3 py-2 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold">{item?.title}</div>
        <div className="text-xs text-muted-foreground">{item?.detail}</div>
      </div>
      <span className="text-[11px] rounded-full border px-2 py-0.5">{item?.priority || "medium"}</span>
    </div>
  );
}

