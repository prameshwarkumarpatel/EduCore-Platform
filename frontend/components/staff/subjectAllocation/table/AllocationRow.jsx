"use client";
import React from "react";
import SubjectBadge from "./SubjectBadge";
import DeleteAllocationButton from "../actions/DeleteAllocationButton";

export default function AllocationRow({ item, selected, onSelect, onDelete, deleting }) {
  return (
    <div className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-2 ${selected ? "border-primary bg-primary/5" : "border-border/40 bg-card/40"}`}>
      <button type="button" className="text-left min-w-0" onClick={onSelect}>
        <div className="font-semibold truncate">{item.teacher?.name || "—"}</div>
        <div className="text-xs text-muted-foreground truncate">{item.className}/{item.section}</div>
      </button>
      <div className="flex items-center gap-2 shrink-0">
        <SubjectBadge subject={item.subject?.name} />
        <DeleteAllocationButton onClick={onDelete} disabled={deleting} />
      </div>
    </div>
  );
}

