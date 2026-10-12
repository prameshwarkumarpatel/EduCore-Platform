"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import ReasonInput from "./ReasonInput";

export default function SubmitLeaveForm({ studentId, onSubmit, busy }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    start: today,
    end: today,
    reason: "",
  });

  const submit = async () => {
    if (!studentId) return alert("Select a student first.");
    if (!form.reason.trim()) return alert("Reason is required.");
    await onSubmit?.({
      studentId,
      startDate: form.start,
      endDate: form.end,
      reason: form.reason,
    });
    setForm({ start: today, end: today, reason: "" });
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Submit Leave</div>
          <div className="text-sm font-semibold text-foreground mt-1">New leave application</div>
        </div>
      </div>

      <DateRangePicker value={{ start: form.start, end: form.end }} onChange={(v) => setForm((p) => ({ ...p, ...v }))} />
      <div className="mt-3">
        <ReasonInput value={form.reason} onChange={(v) => setForm((p) => ({ ...p, reason: v }))} placeholder="Reason for leave" />
      </div>

      <div className="mt-3 flex justify-end">
        <Button onClick={submit} disabled={busy} className="gap-2">
          <Save className="h-4 w-4" />
          {busy ? "Submitting..." : "Submit Leave Request"}
        </Button>
      </div>
    </div>
  );
}

