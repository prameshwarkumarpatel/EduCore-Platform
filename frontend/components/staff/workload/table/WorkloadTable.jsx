"use client";
import React from "react";
import WorkloadRow from "./WorkloadRow";

export default function WorkloadTable({ items = [], onReassign }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Workload Table</div>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => <WorkloadRow key={item.id} item={item} onReassign={onReassign} />) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No workload data found.</div>
        )}
      </div>
    </div>
  );
}

