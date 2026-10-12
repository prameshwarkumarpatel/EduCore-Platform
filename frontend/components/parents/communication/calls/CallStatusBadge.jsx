"use client";
import React from "react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Sent: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  Failed: "border-rose-400/40 bg-rose-500/15 text-rose-200",
  Pending: "border-amber-400/40 bg-amber-500/15 text-amber-200",
};

function labelFromStatus(status) {
  if (status === "Sent") return "Completed";
  if (status === "Failed") return "Missed";
  return status || "Pending";
}

export default function CallStatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", cls)}>
      {labelFromStatus(status)}
    </span>
  );
}

