"use client";
import React from "react";

export default function ReportPreview({ report }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-teal-100/80">Report Preview</div>
      <div className="mt-2 text-xs text-muted-foreground">{report?.reportName || "No report generated yet."}</div>
      {report?.preview?.length ? (
        <div className="mt-2 text-xs text-muted-foreground">Rows: {report.preview.length} · Generated: {new Date(report.generatedAt).toLocaleString()}</div>
      ) : null}
    </div>
  );
}

