"use client";
import React from "react";

export default function DocumentsSummary({ docsSummary }) {
  const s = docsSummary || { total: 0, verified: 0, pending: 0, rejected: 0 };
  return (
    <div className="rounded-xl border border-white/15 bg-black/20 p-4 text-xs space-y-2">
      <div className="text-xs font-black tracking-widest uppercase opacity-80">Documents</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-white/10 p-2">
          <div className="opacity-80">Total</div>
          <div className="text-base font-extrabold">{s.total}</div>
        </div>
        <div className="rounded-lg bg-emerald-500/15 p-2">
          <div className="opacity-80">Verified</div>
          <div className="text-base font-extrabold">{s.verified}</div>
        </div>
        <div className="rounded-lg bg-amber-500/15 p-2">
          <div className="opacity-80">Pending</div>
          <div className="text-base font-extrabold">{s.pending}</div>
        </div>
        <div className="rounded-lg bg-rose-500/15 p-2">
          <div className="opacity-80">Rejected</div>
          <div className="text-base font-extrabold">{s.rejected}</div>
        </div>
      </div>
    </div>
  );
}

