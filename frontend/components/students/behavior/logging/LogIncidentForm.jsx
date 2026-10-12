"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { behaviorApi } from "@/services/api/behaviorApi";
import BehaviorCategorySelect from "./BehaviorCategorySelect";
import RemarksInput from "./RemarksInput";
import IncidentStatusBadge from "../incidents/IncidentStatusBadge";
import { Save } from "lucide-react";

export default function LogIncidentForm({
  studentId,
  categories = [],
  severities = [],
  onLogged,
}) {
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [notes, setNotes] = useState("");
  const [notifyParent, setNotifyParent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!studentId) {
      setError("Please select a student first.");
      return;
    }
    if (!category) {
      setError("Please select an incident category.");
      return;
    }
    if (!severity) {
      setError("Please select severity.");
      return;
    }

    setBusy(true);
    try {
      await behaviorApi.logIncident({
        studentId,
        category,
        severity,
        remarks,
        notes,
        notifyParent,
      });
      setCategory("");
      setSeverity("");
      setRemarks("");
      setNotes("");
      setNotifyParent(false);
      onLogged?.();
    } catch (e) {
      setError(e?.message || "Failed to log incident.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Log Incident</div>
          <div className="text-sm font-semibold text-foreground mt-1">Quick discipline recording</div>
        </div>
        {severity ? <IncidentStatusBadge severity={severity} /> : <div className="text-xs text-muted-foreground">—</div>}
      </div>

      <div className="space-y-3">
        <BehaviorCategorySelect categories={categories} value={category} onChange={setCategory} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select Severity</option>
            {severities.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={notifyParent} onChange={(e) => setNotifyParent(e.target.checked)} />
            Notify parent
          </label>
        </div>

        <RemarksInput value={remarks} onChange={setRemarks} placeholder="Remarks about the incident (required context)" />
        <RemarksInput value={notes} onChange={setNotes} placeholder="Teacher/Admin notes (optional)" />

        {error ? <div className="text-sm text-rose-300">{error}</div> : null}

        <Button onClick={submit} disabled={busy} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {busy ? "Saving..." : "Log Incident"}
        </Button>
      </div>
    </div>
  );
}

