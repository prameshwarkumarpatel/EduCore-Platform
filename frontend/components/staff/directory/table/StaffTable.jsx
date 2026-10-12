"use client";
import React from "react";
import StaffRow from "./StaffRow";

export default function StaffTable(props) {
  const { items, selectedId, onView, onEdit, onDelete, deletingId } = props;
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-indigo-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Staff List</div>
      <div className="mt-3 space-y-2">
        {list.length ? list.map((s) => (
          <StaffRow
            key={s.id}
            item={s}
            selected={selectedId === s.id}
            onView={() => onView?.(s)}
            onEdit={() => onEdit?.(s)}
            onDelete={() => onDelete?.(s)}
            deleting={deletingId === s.id}
          />
        )) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No staff records found.</div>}
      </div>
    </div>
  );
}

