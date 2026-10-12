"use client";
import React from "react";
import Link from "next/link";

export default function AddStaffSidebar() {
  return (
    <div className="rounded-2xl border bg-card/40 p-4 space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Quick Access</div>
      <Link href="/staff/dashboard" className="block text-sm hover:underline">Staff Dashboard</Link>
      <Link href="/staff/directory" className="block text-sm hover:underline">Staff Directory</Link>
      <Link href="/staff/add" className="block text-sm font-semibold text-primary">Add Staff</Link>
    </div>
  );
}

