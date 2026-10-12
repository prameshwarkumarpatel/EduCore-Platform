"use client";
import React from "react";
import DashboardLayout from "@/app/dashboard/layout";

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

