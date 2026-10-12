"use client";
import React, { useState } from "react";
import ConditionsList from "./ConditionsList";
import SeverityBadge from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, Plus } from "lucide-react";

export default function AllergiesSection({ items = [], onAdd, onUpdate, onDelete, busy }) {
  const list = Array.isArray(items) ? items : [];
  const severities = ["Mild", "Moderate", "Severe"];

  const [addOpen, setAddOpen] = useState(true);
  const [form, setForm] = useState({
    condition: "",
    severity: "Mild",
    reaction: "",
    notes: "",
  });

  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({
    condition: "",
    severity: "Mild",
    reaction: "",
    notes: "",
  });

  const startEdit = (it) => {
    setEditId(String(it._id || it.id));
    setEditForm({
      condition: it.condition || "",
      severity: it.severity || "Mild",
      reaction: it.reaction || "",
      notes: it.notes || "",
    });
  };

  const cancelEdit = () => setEditId("");

  const submitAdd = async () => {
    if (!form.condition.trim()) return alert("condition is required");
    await onAdd?.({
      condition: form.condition,
      severity: form.severity,
      reaction: form.reaction,
      notes: form.notes,
    });
    setForm({ condition: "", severity: "Mild", reaction: "", notes: "" });
  };

  const submitEdit = async () => {
    if (!editForm.condition.trim()) return alert("condition is required");
    await onUpdate?.(editId, {
      condition: editForm.condition,
      severity: editForm.severity,
      reaction: editForm.reaction,
      notes: editForm.notes,
    });
    setEditId("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Allergies & Conditions</div>
            <div className="text-sm font-semibold text-foreground mt-1">{list.length} items</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAddOpen((v) => !v)} disabled={busy} className="gap-2">
            <Plus className="h-4 w-4" />
            {addOpen ? "Collapse" : "Add"}
          </Button>
        </div>

        <ConditionsList items={list} onEdit={startEdit} onDelete={onDelete} busy={busy} />
      </div>

      {addOpen ? (
        <div className="rounded-2xl border bg-yellow-500/10 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Add Condition</div>
              <div className="text-sm font-semibold text-foreground mt-1">Allergies, conditions, and notes</div>
            </div>
            <SeverityBadge severity={form.severity} />
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} placeholder="Condition name (e.g., Peanut)" />
            <select
              value={form.severity}
              onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Input value={form.reaction} onChange={(e) => setForm((p) => ({ ...p, reaction: e.target.value }))} placeholder="Reaction (optional)" />
            <Input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes (optional)" />
          </div>

          <div className="mt-3 flex justify-end">
            <Button onClick={submitAdd} disabled={busy || !form.condition.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : "Add Condition"}
            </Button>
          </div>
        </div>
      ) : null}

      {editId ? (
        <div className="rounded-2xl border bg-orange-500/10 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit Condition</div>
              <div className="text-sm font-semibold text-foreground mt-1">Update allergy/condition details</div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={busy} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={editForm.condition} onChange={(e) => setEditForm((p) => ({ ...p, condition: e.target.value }))} placeholder="Condition name" />
            <select
              value={editForm.severity}
              onChange={(e) => setEditForm((p) => ({ ...p, severity: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Input value={editForm.reaction} onChange={(e) => setEditForm((p) => ({ ...p, reaction: e.target.value }))} placeholder="Reaction" />
            <Input value={editForm.notes} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
          </div>

          <div className="mt-3 flex justify-end">
            <Button onClick={submitEdit} disabled={busy || !editForm.condition.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Updating..." : "Update Condition"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

