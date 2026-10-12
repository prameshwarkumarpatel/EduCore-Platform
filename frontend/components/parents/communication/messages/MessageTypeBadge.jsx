"use client";
import React from "react";
import { cn } from "@/lib/utils";

const styles = {
  SMS: "border-blue-400/40 bg-blue-500/15 text-blue-300",
  Email: "border-indigo-400/40 bg-indigo-500/15 text-indigo-300",
  Push: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
};

export default function MessageTypeBadge({ channel }) {
  const cls = styles[channel] || "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", cls)}>
      {channel || "—"}
    </span>
  );
}

