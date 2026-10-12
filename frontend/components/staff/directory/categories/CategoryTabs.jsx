"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CategoryTabs({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <Button variant={value === "ALL" ? "default" : "outline"} size="sm" onClick={() => onChange?.("ALL")}>All</Button>
      <Button variant={value === "Teacher" ? "default" : "outline"} size="sm" onClick={() => onChange?.("Teacher")}>Teaching</Button>
      <Button variant={value === "NonTeaching" ? "default" : "outline"} size="sm" onClick={() => onChange?.("NonTeaching")}>Non-Teaching</Button>
    </div>
  );
}

