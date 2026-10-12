"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportParentDataButton({ onExport, disabled }) {
  return (
    <Button variant="outline" onClick={onExport} disabled={disabled} size="default">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
