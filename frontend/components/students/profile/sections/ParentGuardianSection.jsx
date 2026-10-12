"use client";
import React from "react";

export default function ParentGuardianSection({ student }) {
  const g = student?.guardian || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Parent / Guardian</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="font-semibold text-foreground">{g.name || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Phone</div>
          <div className="font-semibold text-foreground">{g.phone || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="font-semibold text-foreground">{g.email || "—"}</div>
        </div>
      </div>
    </div>
  );
}

