"use client";
import React from "react";
import AttendanceRow from "./AttendanceRow";

export default function DailyAttendanceTable({ items = [], date }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Daily Attendance</div>
      <p className="text-sm text-muted-foreground mt-1">Date: {date}</p>
      <div className="mt-3 space-y-2 max-h-[320px] overflow-y-auto">
        {items.length ? items.map((r) => <AttendanceRow key={r.id} row={r} />) : (
          <div className="py-8 text-center text-sm text-muted-foreground">No records for this date.</div>
        )}
      </div>
    </div>
  );
}
