"use client";
import React, { useRef } from "react";
import AttendanceToggle from "./AttendanceToggle";
import BulkAttendanceButton from "./BulkAttendanceButton";
import { Lock } from "lucide-react";

export default function AttendanceMarkingPanel({ items = [], date, draftById, onToggle, onMarkAll, onSave, busy, isLocked }) {
  const formRef = useRef(null);
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (isLocked) return;
    onSave?.();
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Mark Attendance</div>
        {isLocked ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600">
            <Lock className="w-3 h-3" /> Locked
          </span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground mt-1">Date: {date}</p>
      {isLocked ? (
        <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-500/5 px-3 py-3 text-sm text-amber-700">
          Attendance is locked for this date. No further edits allowed.
        </div>
      ) : (
        <>
          <BulkAttendanceButton onMarkAll={onMarkAll} disabled={busy || !items.length} />
          <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-2">
            <div className="max-h-[280px] overflow-y-auto space-y-2">
              {items.length ? items.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-3 py-2">
                  <div>
                    <div className="font-medium text-sm">{r.staffName}</div>
                    <div className="text-xs text-muted-foreground">{r.department}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Current: {r.status}</span>
                    <AttendanceToggle
                      value={draftById?.[r.id] ?? r.status}
                      onChange={(v) => onToggle?.(r.id, v)}
                    />
                  </div>
                </div>
              )) : <div className="py-6 text-center text-sm text-muted-foreground">No staff for selected filters.</div>}
            </div>
            <button
              type="submit"
              disabled={busy || !items.length}
              className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save Attendance"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
