"use client";
import React from "react";
import LeaveStatusBadge from "./LeaveStatusBadge";

export default function LeaveRequestRow({ item, selected, onSelect }) {
  return (
    <tr className={`border-b hover:bg-muted/40 transition-colors cursor-pointer ${selected ? "bg-primary/5" : ""}`} onClick={() => onSelect?.(item)}>
      <td className="px-5 py-3 text-sm font-semibold text-foreground">{item.student?.name || "—"}</td>
      <td className="px-5 py-3 text-xs text-muted-foreground">{item.student?.enrollmentId || "—"}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">
        {item.startDate ? new Date(item.startDate).toLocaleDateString() : "—"} → {item.endDate ? new Date(item.endDate).toLocaleDateString() : "—"}
      </td>
      <td className="px-5 py-3">
        <LeaveStatusBadge status={item.status} />
      </td>
      <td className="px-5 py-3 text-xs text-muted-foreground max-w-[260px] truncate" title={item.reason}>
        {item.reason}
      </td>
    </tr>
  );
}

