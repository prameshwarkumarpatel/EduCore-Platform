"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function DateRangePicker({ startDate, endDate, onChange }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Date Configuration</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Year start &amp; end</div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Start date</div>
          <Input
            type="date"
            value={startDate ? startDate.substring(0, 10) : ""}
            onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">End date</div>
          <Input
            type="date"
            value={endDate ? endDate.substring(0, 10) : ""}
            onChange={(e) => onChange({ startDate, endDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

