"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function BulkAttendanceButton({ onMarkAll, status, disabled }) {
  return (
    <div className="flex flex-wrap gap-1">
      {["Present", "Absent", "Leave"].map((s) => (
        <Button
          key={s}
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onMarkAll?.(s)}
          disabled={disabled}
        >
          Mark All {s}
        </Button>
      ))}
    </div>
  );
}
