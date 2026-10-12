"use client";
import React from "react";

export default function AddressSection({ parent }) {
  const addr = parent?.address || {};
  const parts = [
    addr.street,
    [addr.city, addr.state].filter(Boolean).join(", "),
    addr.zip,
    addr.country,
  ].filter(Boolean);
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-4 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Address</div>
      <div className="text-sm">
        {parts.length ? (
          <div className="font-medium text-foreground">{parts.join(", ")}</div>
        ) : (
          <div className="text-muted-foreground">—</div>
        )}
      </div>
    </div>
  );
}
