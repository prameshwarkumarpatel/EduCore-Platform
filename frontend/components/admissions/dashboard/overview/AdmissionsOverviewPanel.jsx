"use client";
import React from "react";
import TotalApplicationsCard from "./TotalApplicationsCard";
import ApplicationStatusCard from "./ApplicationStatusCard";

export default function AdmissionsOverviewPanel({ total, byStatus }) {
  const pending = byStatus?.Pending || 0;
  const approved = byStatus?.Approved || 0;
  const rejected = byStatus?.Rejected || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <TotalApplicationsCard total={total} />
      </div>
      <ApplicationStatusCard label="Pending" count={pending} status="Pending" />
      <ApplicationStatusCard label="Approved" count={approved} status="Approved" />
      <ApplicationStatusCard label="Rejected" count={rejected} status="Rejected" />
    </div>
  );
}

