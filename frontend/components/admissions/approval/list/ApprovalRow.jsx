"use client";
import React from "react";
import ApprovalStatusBadge from "./ApprovalStatusBadge";

export default function ApprovalRow({ app, selected, onSelect }) {
  const submitted = app.submittedAt ? new Date(app.submittedAt) : null;
  return (
    <tr
      className={
        "cursor-pointer transition-colors " +
        (selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40")
      }
      onClick={() => onSelect(app)}
    >
      <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
        {submitted ? submitted.toLocaleDateString() : "--"}
      </td>
      <td className="px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap">
        {app.applicantName}
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{app.program}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground text-right">
        <ApprovalStatusBadge status={app.status} />
      </td>
    </tr>
  );
}

