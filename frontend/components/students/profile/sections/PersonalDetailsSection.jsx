"use client";
import React from "react";

export default function PersonalDetailsSection({ student }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Personal</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="font-semibold text-foreground">{student?.name || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Date of Birth</div>
          <div className="font-semibold text-foreground">
            {student?.dob ? new Date(student.dob).toLocaleDateString() : "—"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Gender</div>
          <div className="font-semibold text-foreground">{student?.gender || "—"}</div>
        </div>
      </div>
    </div>
  );
}

