"use client";
import React from "react";
import IncidentStatusBadge from "./IncidentStatusBadge";

export default function IncidentRow({ item, selected, onClick }) {
  return (
    <tr
      className={[
        "border-b hover:bg-muted/40 transition-colors cursor-pointer",
        selected ? "bg-primary/5" : "",
      ].join(" ")}
      onClick={() => onClick?.(item)}
    >
      <td className="px-5 py-3 text-sm font-semibold text-foreground">{item.student?.name || "—"}</td>
      <td className="px-5 py-3 text-xs text-muted-foreground">{item.student?.enrollmentId || "—"}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{item.category}</td>
      <td className="px-5 py-3">
        <IncidentStatusBadge severity={item.severity} />
      </td>
      <td className="px-5 py-3">
        <span
          className={[
            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold",
            item.status === "Resolved"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
              : "bg-amber-500/15 text-amber-300 border-amber-400/20",
          ].join(" ")}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
}

