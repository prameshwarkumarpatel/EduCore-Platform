"use client";
import React from "react";
import RequestItem from "./RequestItem";
import { AlertTriangle } from "lucide-react";

export default function PendingRequestsPanel({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Pending Requests</div>
          <div className="text-sm font-semibold text-foreground mt-1">Updates requiring attention</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
        </div>
      </div>

      {list.length ? (
        <div className="space-y-3">
          {list.map((i) => (
            <RequestItem key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No pending requests.
        </div>
      )}
    </div>
  );
}

