"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

export default function PersonalDetailsForm({ value, onChange }) {
  const v = value || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Personal Details</div>
        <User className="h-4 w-4 text-emerald-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Student name *</div>
          <Input value={v.name || ""} onChange={(e) => onChange?.({ ...v, name: e.target.value })} placeholder="Full name" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Date of birth</div>
          <Input
            type="date"
            value={v.dob ? String(v.dob).slice(0, 10) : ""}
            onChange={(e) => onChange?.({ ...v, dob: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Gender</div>
          <select
            value={v.gender || ""}
            onChange={(e) => onChange?.({ ...v, gender: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Status</div>
          <select
            value={v.status || "Active"}
            onChange={(e) => onChange?.({ ...v, status: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

