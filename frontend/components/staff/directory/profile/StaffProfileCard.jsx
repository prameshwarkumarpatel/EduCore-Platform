"use client";
import React from "react";
import StaffDetailsSection from "./StaffDetailsSection";

export default function StaffProfileCard({ staff }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-violet-100/80">Staff Profile Preview</div>
      {staff ? (
        <div className="mt-3 space-y-2">
          <div className="text-lg font-bold">{staff.name}</div>
          <StaffDetailsSection staff={staff} />
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">Select a staff record to view details.</div>
      )}
    </div>
  );
}

