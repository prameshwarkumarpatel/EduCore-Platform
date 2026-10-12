"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportDirectoryButton({ onExport, disabled }) {
  return (
    <Button onClick={onExport} disabled={disabled} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}

