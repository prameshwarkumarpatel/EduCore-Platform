"use client";
import React from "react";
import DepartmentNameInput from "./DepartmentNameInput";
import DepartmentHeadSelector from "./DepartmentHeadSelector";
import CreateDepartmentButton from "../actions/CreateDepartmentButton";

export default function DepartmentForm({ draft, onChange, staffPool, onCreate, onUpdate, editing, busy }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-5 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-emerald-100/80">Create / Edit Department</div>
      <DepartmentNameInput value={draft?.name} onChange={(name) => onChange({ ...draft, name })} />
      <DepartmentHeadSelector staffPool={staffPool} value={draft?.headId || ""} onChange={(headId) => onChange({ ...draft, headId })} />
      <div className="flex gap-2">
        <CreateDepartmentButton onClick={onCreate} disabled={busy || !String(draft?.name || "").trim()} />
        <button onClick={onUpdate} disabled={busy || !editing} className="h-9 px-4 rounded-md border border-input bg-background text-sm disabled:opacity-50">Update</button>
      </div>
    </div>
  );
}

