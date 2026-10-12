"use client";
import React from "react";
import AlertItem from "./AlertItem";

export default function PendingDocumentsPanel({ pending, onSelect }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-red-600/90 to-rose-600/90 p-5 shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase opacity-80">Pending Alerts</div>
        <div className="text-xs opacity-80">{pending?.length || 0} pending</div>
      </div>
      <div className="mt-3 space-y-2">
        {pending && pending.length ? (
          pending.map((d) => <AlertItem key={d.id} doc={d} onSelect={onSelect} />)
        ) : (
          <div className="text-xs opacity-80">No pending documents right now.</div>
        )}
      </div>
    </div>
  );
}

