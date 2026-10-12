"use client";
import React from "react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

export default function ApplicationCard({ app }) {
  const submitted = app.submittedAt ? new Date(app.submittedAt) : null;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-foreground">{app.applicantName}</div>
        <div className="text-xs text-muted-foreground">{app.program}</div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {submitted ? submitted.toLocaleString() : "Unknown time"}
        </div>
      </div>
      <ApplicationStatusBadge status={app.status} />
    </div>
  );
}

