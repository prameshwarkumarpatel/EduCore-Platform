"use client";
import React from "react";

export default function StaffDetailsSection({ staff }) {
  if (!staff) return null;
  return (
    <div className="text-sm space-y-1">
      <div><span className="text-muted-foreground">Department:</span> {staff.department || "N/A"}</div>
      <div><span className="text-muted-foreground">Email:</span> {staff.email || "N/A"}</div>
      <div><span className="text-muted-foreground">Phone:</span> {staff.phone || "N/A"}</div>
      <div><span className="text-muted-foreground">Status:</span> {staff.status || "Active"}</div>
    </div>
  );
}

