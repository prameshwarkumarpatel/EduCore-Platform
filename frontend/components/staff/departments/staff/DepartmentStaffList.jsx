"use client";
import React from "react";

export default function DepartmentStaffList({ department }) {
  const list = department?.staff || [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-violet-100/80">Department Staff View</div>
      <div className="mt-3 space-y-2">
        {list.length ? list.map((s) => (
          <div key={s.id} className="rounded-lg border bg-card/40 px-3 py-2 text-sm flex justify-between">
            <span>{s.name}</span>
            <span className="text-xs text-muted-foreground">{s.role || s.roleType || ""}</span>
          </div>
        )) : <div className="text-sm text-muted-foreground">No staff assigned.</div>}
      </div>
    </div>
  );
}

