"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function DateFilter({ from, to, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <Input
        type="date"
        value={from ? from.substring(0, 10) : ""}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="h-8 text-xs"
      />
      <span className="text-[11px] text-muted-foreground">to</span>
      <Input
        type="date"
        value={to ? to.substring(0, 10) : ""}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="h-8 text-xs"
      />
    </div>
  );
}

