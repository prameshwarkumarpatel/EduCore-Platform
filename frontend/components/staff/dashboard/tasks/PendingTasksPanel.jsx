"use client";
import React from "react";
import TaskItem from "./TaskItem";

export default function PendingTasksPanel({ items = [] }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-teal-100/80">Pending Tasks</div>
      <div className="mt-3 space-y-2">
        {items.slice(0, 7).map((i) => <TaskItem key={i.id} item={i} />)}
      </div>
    </div>
  );
}

