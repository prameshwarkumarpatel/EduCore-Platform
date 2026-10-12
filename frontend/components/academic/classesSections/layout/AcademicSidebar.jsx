"use client";
import React from "react";
import Link from "next/link";

export default function AcademicSidebar() {
  return (
    <div className="rounded-2xl border bg-card p-4 space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic</div>
      <Link href="/academic/dashboard" className="block text-sm hover:underline">Dashboard</Link>
      <Link href="/academic/classes-sections" className="block text-sm font-semibold text-primary">Classes & Sections</Link>
      <Link href="/staff/subject-allocation" className="block text-sm hover:underline">Teacher Mapping</Link>
    </div>
  );
}
