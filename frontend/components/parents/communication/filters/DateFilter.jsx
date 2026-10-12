"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function DateFilter({ from, to, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-muted-foreground">From</div>
        <Input
          type="date"
          value={from || ""}
          onChange={(e) => onChange?.({ from: e.target.value, to })}
          className="h-9 text-xs"
        />
      </div>
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-muted-foreground">To</div>
        <Input
          type="date"
          value={to || ""}
          onChange={(e) => onChange?.({ from, to: e.target.value })}
          className="h-9 text-xs"
        />
      </div>
    </div>
  );
}

