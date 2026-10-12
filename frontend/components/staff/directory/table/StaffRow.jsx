"use client";
import React from "react";
import StaffTypeBadge from "./StaffTypeBadge";
import ViewStaffButton from "../actions/ViewStaffButton";
import EditStaffButton from "../actions/EditStaffButton";
import DeleteStaffButton from "../actions/DeleteStaffButton";

export default function StaffRow({ item, selected, onView, onEdit, onDelete, deleting }) {
  return (
    <div className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-2 ${selected ? "border-primary bg-primary/5" : "border-border/40 bg-card/40"}`}>
      <div className="min-w-0">
        <div className="font-semibold truncate">{item.name}</div>
        <div className="text-xs text-muted-foreground truncate">{item.department || "N/A"} · {item.email || item.phone || "No contact"}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StaffTypeBadge roleType={item.roleType} />
        <ViewStaffButton onClick={onView} />
        <EditStaffButton onClick={onEdit} />
        <DeleteStaffButton onClick={onDelete} disabled={deleting} />
      </div>
    </div>
  );
}

