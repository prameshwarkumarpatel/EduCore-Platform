"use client";
import React from "react";
import Link from "next/link";

export default function AttendanceSidebar() {
  return (
    <div className="rounded-2xl border bg-card p-4 space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Quick Access</div>
      <Link href="/staff/dashboard" className="block text-sm hover:underline">Staff Dashboard</Link>
      <Link href="/staff/workload" className="block text-sm hover:underline">Workload</Link>
      <Link href="/staff/attendance" className="block text-sm font-semibold text-primary">Attendance</Link>
    </div>
  );
}
