"use client";
import React from "react";
import AttendanceStatusBadge from "./AttendanceStatusBadge";

export default function AttendanceRow({ row }) {
  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="px-5 py-3 text-sm font-semibold text-foreground">{row.name}</td>
      <td className="px-5 py-3 text-xs font-semibold text-muted-foreground">{row.enrollmentId || "—"}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{row.assignedClass || "—"}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{row.assignedSection || "—"}</td>
      <td className="px-5 py-3">
        <AttendanceStatusBadge status={row.attendance} />
      </td>
    </tr>
  );
}

