"use client";
import React from "react";
import ConflictWarningBadge from "./ConflictWarningBadge";

export default function ConflictDetectionPanel({ conflict }) {
  const warnings = conflict?.warnings || [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-amber-100/80">Conflict Detection</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {warnings.length ? warnings.map((w, idx) => <ConflictWarningBadge key={idx} text={w} />) : (
          <div className="text-sm text-emerald-300">No conflicts detected.</div>
        )}
      </div>
    </div>
  );
}

