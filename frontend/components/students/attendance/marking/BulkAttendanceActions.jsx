"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function BulkAttendanceActions({ onMarkAll, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <Button variant="secondary" onClick={() => onMarkAll?.("Present")} disabled={disabled}>
        Mark All Present
      </Button>
      <Button variant="secondary" onClick={() => onMarkAll?.("Late")} disabled={disabled}>
        Mark All Late
      </Button>
      <Button variant="destructive" onClick={() => onMarkAll?.("Absent")} disabled={disabled}>
        Mark All Absent
      </Button>
    </div>
  );
}

