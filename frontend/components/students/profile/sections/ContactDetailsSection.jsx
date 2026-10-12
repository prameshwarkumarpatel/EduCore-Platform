"use client";
import React from "react";

export default function ContactDetailsSection({ student }) {
  const addr = student?.address || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Contact</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div className="font-semibold text-foreground">{student?.email || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Phone</div>
          <div className="font-semibold text-foreground">{student?.phone || "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Address</div>
          <div className="font-semibold text-foreground">
            {[addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(", ") || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

