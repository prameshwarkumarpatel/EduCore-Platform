"use client";
import React from "react";
import AlertItem from "./AlertItem";
import { Siren } from "lucide-react";

export default function StudentAlertsPanel({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-rose-500/15 to-red-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Alerts</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <Siren className="h-4 w-4 text-rose-300" />
        </div>
      </div>
      {list.length ? (
        <div className="space-y-3">
          {list.map((i) => (
            <AlertItem key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No alerts in this range.
        </div>
      )}
    </div>
  );
}

