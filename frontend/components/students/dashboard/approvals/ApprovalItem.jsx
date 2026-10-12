"use client";
import React from "react";
import { CheckCircle2, Clock, FileEdit } from "lucide-react";

export default function ApprovalItem({ item }) {
  const icon = item?.type === "ProfileUpdate" ? <FileEdit className="h-4 w-4 text-orange-300" /> : <Clock className="h-4 w-4 text-orange-300" />;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="rounded-xl border border-border/60 bg-card p-2">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">
          {item?.type === "ProfileUpdate" ? "Profile Update" : "Leave Request"} • {item?.student?.name || "Student"}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {item?.student?.assignedClass || "—"} / {item?.student?.assignedSection || "—"} • Requested{" "}
          {item?.requestedAt ? new Date(item.requestedAt).toLocaleString() : ""}
        </div>
      </div>
      <span className="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-500/15 px-2.5 py-1 text-[11px] font-bold text-orange-300">
        Pending
      </span>
    </div>
  );
}

