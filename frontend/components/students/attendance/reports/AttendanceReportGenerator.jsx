"use client";
import React from "react";
import DownloadReportButton from "./DownloadReportButton";
import { Button } from "@/components/ui/button";

export default function AttendanceReportGenerator({
  start,
  end,
  assignedClass,
  assignedSection,
  onRangeChange,
  disabled,
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm space-y-4">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Reports</div>
        <div className="text-sm font-semibold text-foreground mt-1">Generate attendance report</div>
        <div className="text-xs text-muted-foreground mt-1">Export CSV for selected date range and class/section.</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          value={start || ""}
          onChange={(e) => onRangeChange?.({ start: e.target.value, end })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <input
          type="date"
          value={end || ""}
          onChange={(e) => onRangeChange?.({ start, end: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {assignedClass ? assignedClass : "All classes"} • {assignedSection ? assignedSection : "All sections"}
        </div>
        <DownloadReportButton
          start={start}
          end={end}
          assignedClass={assignedClass}
          assignedSection={assignedSection}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

