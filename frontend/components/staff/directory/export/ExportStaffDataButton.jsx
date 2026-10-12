"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ExportStaffDataButton({ onExport, busy }) {
  return <Button type="button" variant="outline" onClick={onExport} disabled={busy}>{busy ? "Exporting..." : "Export CSV"}</Button>;
}

