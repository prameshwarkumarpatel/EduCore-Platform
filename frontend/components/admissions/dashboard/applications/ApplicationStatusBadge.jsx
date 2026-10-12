"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function ApplicationStatusBadge({ status }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border";
  if (status === "Approved") {
    return (
      <span className={cn(base, "border-emerald-300/50 bg-emerald-500/10 text-emerald-400")}>Approved</span>
    );
  }
  if (status === "Rejected") {
    return (
      <span className={cn(base, "border-rose-300/50 bg-rose-500/10 text-rose-300")}>Rejected</span>
    );
  }
  return (
    <span className={cn(base, "border-amber-300/50 bg-amber-500/10 text-amber-300")}>Pending</span>
  );
}

