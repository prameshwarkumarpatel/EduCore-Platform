"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function DepartmentFilter({ value, onChange }) {
  return <Input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder="Search departments..." className="md:w-72" />;
}

