"use client";
import React from "react";
import StaffTag from "./StaffTag";

export default function AssignStaffPanel({ staffPool, selectedIds, onToggle, onSave, busy, disabled }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-amber-100/80">Staff Assignment Panel</div>
      <div className="mt-3 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {(staffPool || []).map((s) => (
          <StaffTag key={s.id} staff={s} selected={(selectedIds || []).includes(s.id)} onToggle={onToggle} />
        ))}
      </div>
      <button onClick={onSave} disabled={busy || disabled} className="mt-3 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50">
        {busy ? "Saving..." : "Save Assignment"}
      </button>
    </div>
  );
}

