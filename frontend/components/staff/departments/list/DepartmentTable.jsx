"use client";
import React from "react";
import DepartmentRow from "./DepartmentRow";

export default function DepartmentTable({ items, selectedId, onView, onEdit, onDelete, deletingId }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-indigo-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Departments List</div>
      <div className="mt-3 space-y-2">
        {list.length ? list.map((d) => (
          <DepartmentRow
            key={d.id}
            item={d}
            selected={selectedId === d.id}
            onView={() => onView?.(d)}
            onEdit={() => onEdit?.(d)}
            onDelete={() => onDelete?.(d)}
            deleting={deletingId === d.id}
          />
        )) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No departments found.</div>}
      </div>
    </div>
  );
}

