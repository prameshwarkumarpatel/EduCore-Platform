"use client";
import React from "react";

export default function AlertItem({ item }) {
  const severityCls =
    item?.status === "High"
      ? "bg-rose-500/15 text-rose-300 border-rose-400/20"
      : item?.status === "Medium"
        ? "bg-amber-500/15 text-amber-300 border-amber-400/20"
        : "bg-emerald-500/15 text-emerald-300 border-emerald-400/20";

  return (
    <div className="rounded-2xl border bg-background/40 p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="font-bold text-foreground truncate">{item?.name}</div>
        <div className="text-xs text-muted-foreground truncate">{item?.enrollmentId || "—"}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {item?.assignedClass || "—"} • {item?.assignedSection || "—"}
        </div>
      </div>
      <div className="text-right">
        <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${severityCls}`}>
          {item?.status || "Low"}
        </div>
        <div className="mt-2 font-extrabold text-foreground">{item?.attendedPct ?? 0}%</div>
        <div className="text-[11px] text-muted-foreground">attended</div>
      </div>
    </div>
  );
}

