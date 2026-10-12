"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Power } from "lucide-react";

export default function AcademicYearStatusToggle({ year, onToggle, disabled }) {
  if (!year) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-5 text-sm text-muted-foreground">
        Select a year to control its active status.
      </div>
    );
  }

  const isActive = Boolean(year.isActive);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Active Academic Year
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Current status:{" "}
            <span className={cn("font-semibold", isActive ? "text-emerald-400" : "text-rose-400")}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Only one academic year can be active at a time across the system.
          </div>
        </div>
        <Button
          disabled={disabled}
          onClick={() => onToggle(!isActive)}
          className={cn(
            "gap-2",
            isActive
              ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-400 hover:to-orange-400"
              : "bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
          )}
        >
          <Power className="h-4 w-4" />
          {isActive ? "Deactivate" : "Set as active"}
        </Button>
      </div>
    </div>
  );
}

