"use client";
import React from "react";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  low: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  medium: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  high: "border-rose-400/40 bg-rose-500/15 text-rose-200",
};

function SeverityBadge({ severity }) {
  const cls = SEVERITY_STYLES[severity] || "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", cls)}>
      {severity || "low"}
    </span>
  );
}

export default function NotificationItem({ item }) {
  const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "";
  return (
    <div className="rounded-xl border bg-card/60 p-3 hover:bg-primary/5 transition-colors">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={item?.severity} />
          <span className="inline-flex rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {item?.status || "Sent"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{createdAt}</div>
      </div>
      <div className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">{item?.message || ""}</div>
    </div>
  );
}

