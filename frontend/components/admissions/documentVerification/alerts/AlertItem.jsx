"use client";
import React from "react";
import VerificationStatusBadge from "../list/VerificationStatusBadge";

export default function AlertItem({ doc, onSelect }) {
  return (
    <button
      onClick={() => onSelect(doc)}
      className="w-full text-left rounded-xl border border-red-500/20 bg-red-500/5 p-3 hover:bg-red-500/10 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-foreground">{doc.applicantName}</div>
          <div className="text-[11px] text-muted-foreground">{doc.type}</div>
        </div>
        <VerificationStatusBadge status={doc.verificationStatus} />
      </div>
    </button>
  );
}

