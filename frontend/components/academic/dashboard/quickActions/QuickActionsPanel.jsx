"use client";
import React from "react";
import QuickActionCard from "./QuickActionCard";

export default function QuickActionsPanel() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Quick Actions</div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <QuickActionCard title="Staff dashboard" description="Allocate subjects & workload" href="/staff/dashboard" />
        <QuickActionCard title="Students" description="Directory & attendance" href="/students/dashboard" />
        <QuickActionCard title="Academic year" description="Administration setup" href="/dashboard/administration/academic-year" />
      </div>
    </div>
  );
}
