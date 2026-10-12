"use client";
import React from "react";
import MessageTypeBadge from "./MessageTypeBadge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Pending: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  Sent: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  Failed: "border-rose-400/40 bg-rose-500/15 text-rose-200",
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", cls)}>
      {status || "—"}
    </span>
  );
}

export default function MessageRow({ item }) {
  const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "";
  const direction = item?.direction || "Outgoing";
  return (
    <div className="rounded-xl border bg-card/60 p-3 hover:bg-primary/5 transition-colors">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <MessageTypeBadge channel={item?.channel} />
          <StatusBadge status={item?.status} />
          <span className="inline-flex rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {direction}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{createdAt}</div>
      </div>
      <div className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">
        {item?.message || ""}
      </div>
    </div>
  );
}

