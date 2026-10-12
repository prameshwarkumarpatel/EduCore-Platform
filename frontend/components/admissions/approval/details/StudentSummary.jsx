"use client";
import React from "react";

export default function StudentSummary({ app }) {
  return (
    <div className="rounded-xl border border-white/15 bg-black/20 p-4 text-xs space-y-1.5">
      <div className="text-xs font-black tracking-widest uppercase opacity-80">Student</div>
      <div className="text-lg font-extrabold tracking-tight">{app.applicantName}</div>
      <div className="opacity-90">{app.applicantEmail}</div>
      {app.applicantPhone ? <div className="opacity-90">{app.applicantPhone}</div> : null}
      <div className="opacity-90">Applied: {app.program}</div>
    </div>
  );
}

