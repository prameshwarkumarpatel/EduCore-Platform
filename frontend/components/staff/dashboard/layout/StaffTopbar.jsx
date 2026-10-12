"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function StaffTopbar({ onRefresh, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Teacher & Staff Dashboard</h1>
        <p className="text-muted-foreground mt-1">Centralized overview of staff, workload, attendance, payroll, and activities.</p>
      </div>
      <Button variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}

