"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function GenerateReportButton({ onClick, loading }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={loading}>
      {loading ? "Generating..." : "Generate Report"}
    </Button>
  );
}
