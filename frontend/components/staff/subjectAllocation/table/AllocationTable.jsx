"use client";
import React from "react";
import AllocationRow from "./AllocationRow";

export default function AllocationTable({ items, selectedId, onSelect, onDelete, deletingId }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-emerald-100/80">Allocation List</div>
      <div className="mt-3 space-y-2">
        {list.length ? list.map((a) => (
          <AllocationRow key={a.id} item={a} selected={selectedId === a.id} onSelect={() => onSelect?.(a)} onDelete={() => onDelete?.(a)} deleting={deletingId === a.id} />
        )) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No allocations found.</div>}
      </div>
    </div>
  );
}

