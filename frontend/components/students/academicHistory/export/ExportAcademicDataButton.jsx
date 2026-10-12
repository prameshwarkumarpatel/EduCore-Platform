"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { academicHistoryApi } from "@/services/api/academicHistoryApi";

export default function ExportAcademicDataButton({ studentId, disabled }) {
  const exportCsv = async () => {
    if (!studentId) return;
    try {
      const csv = await academicHistoryApi.exportAcademicData(studentId);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "academic-history.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e?.message || "Export failed");
    }
  };

  return (
    <Button onClick={exportCsv} disabled={disabled || !studentId} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}

