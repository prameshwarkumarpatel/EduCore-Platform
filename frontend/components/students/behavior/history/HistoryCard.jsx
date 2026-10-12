"use client";
import React from "react";
import IncidentStatusBadge from "../incidents/IncidentStatusBadge";

export default function HistoryCard({ incident }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground truncate">{incident.category}</div>
          <div className="mt-1 text-sm font-semibold text-foreground">{incident.student?.name || "—"}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {incident.student?.enrollmentId || "—"} • {incident.status}
          </div>
        </div>
        <div>
          <IncidentStatusBadge severity={incident.severity} />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {incident.remarks ? (
          <div className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Remarks:</span> {incident.remarks}
          </div>
        ) : null}
        {incident.notes ? (
          <div className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Notes:</span> {incident.notes}
          </div>
        ) : null}
        <div className="text-[11px] text-muted-foreground">
          {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
}

