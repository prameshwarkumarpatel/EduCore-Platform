"use client";
import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdjustWorkloadPanel({ items = [], staff = [], onAdjust, busy }) {
  const [fromStaffId, setFromStaffId] = useState("");
  const [allocationId, setAllocationId] = useState("");
  const [toStaffId, setToStaffId] = useState("");
  const [localError, setLocalError] = useState("");
  const allocationSelectRef = useRef(null);
  const targetSelectRef = useRef(null);

  const source = useMemo(() => items.find((i) => i.id === fromStaffId), [items, fromStaffId]);
  const assignments = source?.assignments || [];

  const submit = (e) => {
    e?.preventDefault?.();
    setLocalError("");
    const allocId = (allocationSelectRef.current?.value ?? allocationId ?? "").trim();
    const toId = (targetSelectRef.current?.value ?? toStaffId ?? "").trim();
    if (!allocId || !toId) {
      setLocalError("Select source allocation and target teacher.");
      return;
    }
    onAdjust?.({ allocationId: allocId, toStaffId: toId });
  };

  const targetStaff = staff.filter((s) => s.id !== fromStaffId);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Adjust Workload</div>
      <form onSubmit={submit} className="space-y-2">
        <select
          value={fromStaffId}
          onChange={(e) => { setFromStaffId(e.target.value); setAllocationId(""); setLocalError(""); }}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Source teacher"
        >
          <option value="">Select source teacher</option>
          {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select
          ref={allocationSelectRef}
          value={allocationId}
          onChange={(e) => { setAllocationId(e.target.value); setLocalError(""); }}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Class/subject to reassign"
        >
          <option value="">Select class/subject to reassign</option>
          {assignments.map((a) => (
            <option key={a.allocationId} value={a.allocationId || ""}>
              {a.subjectName} - {a.className}/{a.section}
            </option>
          ))}
        </select>
        <select
          ref={targetSelectRef}
          value={toStaffId}
          onChange={(e) => { setToStaffId(e.target.value); setLocalError(""); }}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Target teacher"
        >
          <option value="">Select target teacher</option>
          {targetStaff.map((s) => <option key={s.id} value={s.id || ""}>{s.name}</option>)}
        </select>
        {!assignments.length && fromStaffId ? <div className="text-xs text-muted-foreground">No reassignable allocations available for this teacher.</div> : null}
        {localError ? <div className="text-xs text-rose-300">{localError}</div> : null}
        <Button type="submit" disabled={busy}>Apply Reassignment</Button>
      </form>
    </div>
  );
}

