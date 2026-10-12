"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { attendanceApi } from "@/services/api/attendanceApi";

export default function DownloadReportButton({ start, end, assignedClass, assignedSection, disabled }) {
  const download = async () => {
    const csv = await attendanceApi.exportReportCsv({ start, end, assignedClass, assignedSection });
    const blob = new Blob([csv || ""], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} disabled={disabled} className="gap-2">
      <Download className="h-4 w-4" />
      Download Report
    </Button>
  );
}

