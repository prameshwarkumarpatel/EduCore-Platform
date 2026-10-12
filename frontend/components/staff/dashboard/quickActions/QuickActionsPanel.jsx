"use client";
import React from "react";
import { useRouter } from "next/navigation";
import QuickActionCard from "./QuickActionCard";

export default function QuickActionsPanel() {
  const router = useRouter();
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-zinc-700/30 to-slate-700/20 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-zinc-200/90">Quick Actions</div>
      <div className="mt-3 space-y-2">
        <QuickActionCard title="Add Staff" onClick={() => router.push("/staff/dashboard")} />
        <QuickActionCard title="Assign Workload" onClick={() => router.push("/staff/dashboard")} />
        <QuickActionCard title="Process Payroll" onClick={() => router.push("/staff/dashboard")} />
      </div>
    </div>
  );
}

