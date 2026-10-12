"use client";
import React from "react";
import DepartmentHeadBadge from "./DepartmentHeadBadge";
import ViewDepartmentButton from "../actions/ViewDepartmentButton";
import EditDepartmentButton from "../actions/EditDepartmentButton";
import DeleteDepartmentButton from "../actions/DeleteDepartmentButton";

export default function DepartmentRow({ item, selected, onView, onEdit, onDelete, deleting }) {
  return (
    <div className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-2 ${selected ? "border-primary bg-primary/5" : "border-border/40 bg-card/40"}`}>
      <div className="min-w-0">
        <div className="font-semibold truncate">{item.name}</div>
        <div className="text-xs text-muted-foreground">Staff: {item.staffCount || 0}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <DepartmentHeadBadge head={item.head} />
        <ViewDepartmentButton onClick={onView} />
        <EditDepartmentButton onClick={onEdit} />
        <DeleteDepartmentButton onClick={onDelete} disabled={deleting} />
      </div>
    </div>
  );
}

