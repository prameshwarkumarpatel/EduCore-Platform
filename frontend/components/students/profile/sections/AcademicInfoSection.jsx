"use client";
import React from "react";

export default function AcademicInfoSection({ student }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Class / Section</div>
          <div className="font-semibold text-foreground">
            {student?.assignedClass || "—"} / {student?.assignedSection || "—"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Status</div>
          <div className="font-semibold text-foreground">{student?.status || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Activities</div>
          <div className="font-semibold text-foreground">
            {student?.extracurricular?.summary || "Activities can be tracked here later."}
          </div>
        </div>
      </div>
    </div>
  );
}

