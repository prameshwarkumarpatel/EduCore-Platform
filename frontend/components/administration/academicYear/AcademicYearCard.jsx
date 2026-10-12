"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CalendarRange } from "lucide-react";

export default function AcademicYearCard({ year, selected, onSelect }) {
  const start = year.startDate ? new Date(year.startDate) : null;
  const end = year.endDate ? new Date(year.endDate) : null;

  return (
    <button
      onClick={() => onSelect(year)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md",
        selected ? "border-primary/40 bg-primary/5" : "border-muted bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl grid place-items-center text-white shadow bg-gradient-to-br from-sky-500 to-indigo-600">
          <CalendarRange className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate">
              <div className="font-bold text-foreground truncate">{year.year}</div>
              <div className="text-xs text-muted-foreground truncate">
                {start && end ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}` : "No dates configured"}
              </div>
            </div>
            <div
              className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border",
                year.isActive
                  ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-400"
                  : "border-muted bg-muted text-muted-foreground"
              )}
            >
              {year.isActive ? "Active" : year.status || "Inactive"}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

