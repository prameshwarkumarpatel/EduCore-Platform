"use client";
import React from "react";
import { ShieldAlert, User } from "lucide-react";

export default function AlertItem({ item }) {
  const color =
    item?.severity === "high"
      ? "border-rose-400/20 bg-rose-500/15 text-rose-300"
      : item?.severity === "medium"
        ? "border-amber-400/20 bg-amber-500/15 text-amber-300"
        : "border-sky-400/20 bg-sky-500/15 text-sky-300";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="rounded-xl border border-border/60 bg-card p-2">
        <ShieldAlert className="h-4 w-4 text-rose-300" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">{item?.title || "Alert"}</div>
        <div className="text-xs text-muted-foreground">{item?.message || ""}</div>
        {item?.student?.name ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            Student: {item.student.name} • {item.student.assignedClass || "—"}-{item.student.assignedSection || "—"}
          </div>
        ) : null}
      </div>
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${color}`}>
        {item?.severity || "low"}
      </span>
    </div>
  );
}

