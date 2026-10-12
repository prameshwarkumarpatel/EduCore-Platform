"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarRange, X } from "lucide-react";

export default function DateRangeFilter({ from, to, onChange }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-2">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <CalendarRange className="h-4 w-4 text-teal-500" />
        <span>Date range</span>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center">
        <Input
          type="date"
          value={from ? from.substring(0, 10) : ""}
          onChange={(e) => onChange({ from: e.target.value, to })}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={to ? to.substring(0, 10) : ""}
          onChange={(e) => onChange({ from, to: e.target.value })}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={() => onChange({ from: "", to: "" })}
      >
        <X className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}

