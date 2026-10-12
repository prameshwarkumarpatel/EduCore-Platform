"use client";
import React from "react";
import ParentStatusBadge from "./ParentStatusBadge";

export default function ParentRow({ parent, selected, onSelect, onView, onEdit, onDelete }) {
  if (!parent) return null;
  return (
    <tr
      className={`border-b border-border/40 transition-colors ${
        selected ? "bg-primary/5" : "hover:bg-muted/20"
      }`}
    >
      <td className="px-5 py-3">
        <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px] block" title={parent.id}>
          {parent.id || "—"}
        </span>
      </td>
      <td className="px-5 py-3">
        <button
          type="button"
          onClick={() => onSelect?.(parent)}
          className="font-semibold text-foreground hover:text-primary text-left truncate max-w-[180px] block"
        >
          {parent.name || "—"}
        </button>
      </td>
      <td className="px-5 py-3 text-muted-foreground text-sm truncate max-w-[140px]">
        {parent.email || "—"}
      </td>
      <td className="px-5 py-3 text-muted-foreground text-sm truncate max-w-[120px]">
        {parent.phone || "—"}
      </td>
      <td className="px-5 py-3">
        <span className="text-xs text-muted-foreground">{parent.studentsCount ?? 0} linked</span>
      </td>
      <td className="px-5 py-3">
        <ParentStatusBadge status={parent.status} />
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {onView && (
            <button
              type="button"
              onClick={() => onView(parent)}
              className="text-xs px-2 py-1 rounded border border-border/60 hover:bg-muted/40 text-foreground"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(parent)}
              className="text-xs px-2 py-1 rounded border border-border/60 hover:bg-muted/40 text-foreground"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(parent)}
              className="text-xs px-2 py-1 rounded border border-rose-400/40 hover:bg-rose-500/10 text-rose-300"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
