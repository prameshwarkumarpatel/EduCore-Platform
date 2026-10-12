"use client";
import React from "react";

export default function PayrollStatsPanel({ payroll }) {
  const items = payroll?.items || [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-red-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-red-100/80">Payroll Stats</div>
      <div className="mt-3 space-y-2">
        {items.slice(0, 5).map((r) => (
          <div key={r.id} className="rounded-lg border bg-card/40 px-3 py-2 text-xs flex justify-between">
            <span>{r.staffName}</span>
            <span className="font-semibold">{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

