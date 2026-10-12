"use client";
import React from "react";
import Link from "next/link";

export default function AcademicSidebar() {
  return (
    <div className="rounded-2xl border bg-card p-4 space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic</div>
      <Link href="/academic/dashboard" className="block text-sm font-semibold text-primary">Dashboard</Link>
      <Link href="/students/dashboard" className="block text-sm hover:underline">Student Mgmt</Link>
      <Link href="/staff/dashboard" className="block text-sm hover:underline">Teacher & Staff</Link>
    </div>
  );
}
