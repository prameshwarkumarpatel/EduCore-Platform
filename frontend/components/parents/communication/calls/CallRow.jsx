"use client";
import React from "react";
import CallStatusBadge from "./CallStatusBadge";

export default function CallRow({ item }) {
  const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "";
  return (
    <div className="rounded-xl border bg-card/60 p-3 hover:bg-primary/5 transition-colors">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <CallStatusBadge status={item?.status} />
          <span className="inline-flex rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {item?.direction || "Outgoing"}
          </span>
          <span className="inline-flex rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {item?.channel || "Call"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{createdAt}</div>
      </div>
      <div className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">{item?.message || ""}</div>
    </div>
  );
}

