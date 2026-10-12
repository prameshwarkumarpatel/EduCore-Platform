"use client";
import React from "react";
import VerificationStatusBadge from "./VerificationStatusBadge";

export default function DocumentRow({ doc, selected, onSelect }) {
  const uploaded = doc.uploadedAt ? new Date(doc.uploadedAt) : null;
  return (
    <tr
      className={
        "cursor-pointer transition-colors " +
        (selected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40")
      }
      onClick={() => onSelect(doc)}
    >
      <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
        {uploaded ? uploaded.toLocaleDateString() : "--"}
      </td>
      <td className="px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap">
        {doc.applicantName}
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{doc.type}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{doc.program}</td>
      <td className="px-3 py-2 text-xs text-right">
        <VerificationStatusBadge status={doc.verificationStatus} />
      </td>
    </tr>
  );
}

