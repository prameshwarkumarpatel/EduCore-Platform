"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import ErrorMessage from "../validation/ErrorMessage";

export default function PersonalDetailsForm({ value, onChange, errors }) {
  const v = value || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-sky-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Personal Details</div>
      <div>
        <Input value={v.name || ""} onChange={(e) => onChange({ ...v, name: e.target.value })} placeholder="Full name" />
        <ErrorMessage message={errors?.name} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input type="date" value={v.dob || ""} onChange={(e) => onChange({ ...v, dob: e.target.value })} />
        <select value={v.gender || ""} onChange={(e) => onChange({ ...v, gender: e.target.value })} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Input value={v.email || ""} onChange={(e) => onChange({ ...v, email: e.target.value })} placeholder="Email" />
          <ErrorMessage message={errors?.email} />
        </div>
        <Input value={v.phone || ""} onChange={(e) => onChange({ ...v, phone: e.target.value })} placeholder="Phone" />
      </div>
    </div>
  );
}

