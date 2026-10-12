"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import ErrorMessage from "../validation/ErrorMessage";

export default function JoiningDetailsForm({ value, onChange, errors }) {
  const v = value || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-orange-100/80">Joining Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Input type="date" value={v.joiningDate || ""} onChange={(e) => onChange({ ...v, joiningDate: e.target.value })} />
          <ErrorMessage message={errors?.joiningDate} />
        </div>
        <Input value={v.employeeId || ""} onChange={(e) => onChange({ ...v, employeeId: e.target.value })} placeholder="Employee ID" />
      </div>
      <select value={v.status || "Active"} onChange={(e) => onChange({ ...v, status: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}

