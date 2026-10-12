"use client";
import React from "react";
import AttendanceToggle from "./AttendanceToggle";
import AttendanceStatusBadge from "../logs/AttendanceStatusBadge";
import BulkAttendanceActions from "./BulkAttendanceActions";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function MarkAttendancePanel({
  rows = [],
  draftById = {},
  onToggle,
  onMarkAll,
  onSave,
  busy,
}) {
  const list = Array.isArray(rows) ? rows : [];

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Mark Attendance</div>
          <div className="text-sm font-semibold text-foreground mt-1">Present / Late / Absent</div>
        </div>
        <div className="text-xs text-muted-foreground">{list.length} students</div>
      </div>

      <BulkAttendanceActions onMarkAll={onMarkAll} disabled={busy || !list.length} />

      <div className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Student</th>
              <th className="px-5 py-3 font-bold">Current</th>
              <th className="px-5 py-3 font-bold">Set</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((r) => {
                const current = r.attendance || "Unmarked";
                const next = draftById[r.id] || current;
                return (
                  <tr key={r.id} className="border-b last:border-b-0">
                    <td className="px-5 py-3 font-semibold">{r.name}</td>
                    <td className="px-5 py-3">
                      <AttendanceStatusBadge status={current} />
                    </td>
                    <td className="px-5 py-3">
                      <AttendanceToggle value={next === "Unmarked" ? "Present" : next} onChange={(v) => onToggle?.(r.id, v)} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Select class/section and date to mark attendance.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button onClick={onSave} disabled={busy || !list.length} className="gap-2">
          <Save className="h-4 w-4" />
          {busy ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
}

