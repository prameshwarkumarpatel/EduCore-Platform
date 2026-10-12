"use client";
import React from "react";
import GenerateReportButton from "./GenerateReportButton";
import { Button } from "@/components/ui/button";

export default function AttendanceReportPanel({ onGenerate, report, onDownload, loading }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Attendance Reports</div>
      <p className="text-sm text-muted-foreground mt-1">Export monthly attendance with date-wise records (Staff, Date, Status).</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <GenerateReportButton onClick={onGenerate} loading={loading} />
        {report?.csv ? (
          <Button type="button" variant="outline" onClick={onDownload}>
            Download CSV
          </Button>
        ) : null}
      </div>
      {report?.reportName ? (
        <p className="mt-2 text-xs text-muted-foreground">Ready: {report.reportName}</p>
      ) : null}
    </div>
  );
}
