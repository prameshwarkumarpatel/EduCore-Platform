"use client";
import React from "react";
import EnrollmentStatusBadge from "./EnrollmentStatusBadge";
import { cn } from "@/lib/utils";

export default function EnrollmentRow({ row, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(row)}
      className={cn(
        "w-full text-left rounded-xl border p-3 transition-all",
        selected
          ? "border-primary/30 bg-primary/10 shadow-sm"
          : "border-border/60 bg-card hover:bg-muted/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-bold text-foreground truncate">{row?.student?.name || "Unknown Student"}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row?.enrollmentId} • {row?.student?.email || "—"}
          </div>
        </div>
        <EnrollmentStatusBadge status={row?.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border/60 bg-background/40 px-2 py-1.5">
          <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Class</div>
          <div className="font-semibold text-foreground">{row?.assignedClass || "—"}</div>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/40 px-2 py-1.5">
          <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Section</div>
          <div className="font-semibold text-foreground">{row?.assignedSection || "—"}</div>
        </div>
      </div>
    </button>
  );
}

