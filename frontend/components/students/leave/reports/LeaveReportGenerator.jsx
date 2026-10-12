"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { leaveApi } from "@/services/api/leaveApi";
import ExportLeaveReport from "./ExportLeaveReport";
import { FileText } from "lucide-react";

export default function LeaveReportGenerator({ filters, disabled }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const generate = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await leaveApi.generateReport(filters || {});
      setPreview(res?.content || "");
    } catch (e) {
      setError(e?.message || "Failed to generate report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Leave Reports</div>
          <div className="text-sm font-semibold text-foreground mt-1">Generate and export leave data</div>
        </div>
        <FileText className="h-5 w-5 text-orange-300" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <Button onClick={generate} disabled={disabled || busy} className="gap-2">
          {busy ? "Generating..." : "Generate Report"}
        </Button>
        <ExportLeaveReport filters={filters} disabled={disabled || busy} />
      </div>

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      <div className="rounded-xl border border-border/60 bg-background/40 p-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">Preview</div>
        {preview ? (
          <div className="max-h-72 overflow-auto" dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <div className="text-sm text-muted-foreground">Generate report to preview here.</div>
        )}
      </div>
    </div>
  );
}

