"use client";
import React from "react";

export default function PersonalDetailsSection({ parent }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Personal Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div className="font-semibold text-foreground">{parent?.name || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Relationship</div>
          <div className="font-semibold text-foreground">{parent?.relationship || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Status</div>
          <div className="font-semibold text-foreground">{parent?.status || "—"}</div>
        </div>
      </div>
    </div>
  );
}
