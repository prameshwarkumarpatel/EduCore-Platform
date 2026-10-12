"use client";
import React from "react";

export default function AlertItem({ item }) {
  if (!item) return null;
  const severity = item.severity || "medium";
  const badge =
    severity === "high"
      ? "bg-rose-500/15 border-rose-400/30 text-rose-200"
      : severity === "medium"
      ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
      : "bg-emerald-500/15 border-emerald-400/30 text-emerald-200";

  return (
    <div className="rounded-xl border bg-background/30 p-3 hover:bg-muted/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{item.parent?.name || "Parent"}</div>
          <div className="text-[12px] text-muted-foreground mt-1 truncate">
            {item.student?.name ? `${item.student.name} · ` : ""}{item.status || item.severity || ""}
          </div>
        </div>
        <div className={`shrink-0 text-[11px] border px-2 py-1 rounded-full ${badge}`}>{severity.toUpperCase()}</div>
      </div>
      <div className="text-sm text-foreground mt-2 line-clamp-2">{item.message || "—"}</div>
      <div className="text-[11px] text-muted-foreground mt-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}</div>
    </div>
  );
}

