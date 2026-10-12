"use client";
import React from "react";

export default function ContactDetailsSection({ parent }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Contact Information</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="font-semibold text-foreground truncate">{parent?.email || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Phone</div>
          <div className="font-semibold text-foreground">{parent?.phone || "—"}</div>
        </div>
      </div>
    </div>
  );
}
