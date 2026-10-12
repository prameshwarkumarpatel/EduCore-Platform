"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { leaveApi } from "@/services/api/leaveApi";

export default function ExportLeaveReport({ filters, disabled }) {
  const download = async () => {
    const csv = await leaveApi.exportReportCsv(filters || {});
    const blob = new Blob([csv || ""], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} disabled={disabled} className="gap-2">
      <Download className="h-4 w-4" />
      Download CSV
    </Button>
  );
}

