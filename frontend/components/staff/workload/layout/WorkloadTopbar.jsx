"use client";
import React from "react";
import GenerateReportButton from "../reports/GenerateReportButton";

export default function WorkloadTopbar({ onGenerate, loading }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workload</h1>
        <p className="text-muted-foreground text-sm">Monitor teaching load, rebalance assignments, and export report snapshots.</p>
      </div>
      <GenerateReportButton onClick={onGenerate} loading={loading} />
    </div>
  );
}

