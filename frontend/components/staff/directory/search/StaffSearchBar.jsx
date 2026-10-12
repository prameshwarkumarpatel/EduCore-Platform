"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function StaffSearchBar({ value, onChange }) {
  return <Input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder="Search staff..." className="md:w-72" />;
}

