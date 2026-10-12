"use client";
import React, { useMemo, useState } from "react";
import HistoryCard from "./HistoryCard";
import AddMedicalRecordButton from "../actions/AddMedicalRecordButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";

function normalizeDateValue(v) {
  if (!v) return "";
  // v could be ISO or yyyy-mm-dd
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function MedicalHistorySection({ items = [], onAdd, onUpdate, onDelete, busy }) {
  const list = Array.isArray(items) ? items : [];
  const recordTypes = useMemo(() => ["General", "Diagnosis", "Treatment"], []);

  const [addOpen, setAddOpen] = useState(true);
  const [form, setForm] = useState({
    recordType: "General",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    treatment: "",
    notes: "",
  });

  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({
    recordType: "General",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    treatment: "",
    notes: "",
  });

  const startEdit = (r) => {
    if (!r) return;
    setEditId(String(r._id || r.id || ""));
    setEditForm({
      recordType: r.recordType || "General",
      title: r.title || "",
      date: normalizeDateValue(r.date) || new Date().toISOString().slice(0, 10),
      treatment: r.treatment || "",
      notes: r.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditId("");
  };

  const handleSubmitAdd = async () => {
    if (!form.title.trim()) return alert("Title is required");
    await onAdd?.({
      recordType: form.recordType,
      title: form.title,
      date: form.date,
      treatment: form.treatment,
      notes: form.notes,
    });
    setForm((p) => ({ ...p, title: "", treatment: "", notes: "" }));
  };

  const handleSubmitEdit = async () => {
    if (!editForm.title.trim()) return alert("Title is required");
    await onUpdate?.(editId, {
      recordType: editForm.recordType,
      title: editForm.title,
      date: editForm.date,
      treatment: editForm.treatment,
      notes: editForm.notes,
    });
    setEditId("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Medical History</div>
            <div className="text-sm font-semibold text-foreground mt-1">{list.length} records</div>
          </div>
          <AddMedicalRecordButton
            onClick={() => setAddOpen((v) => !v)}
            disabled={busy}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {list.length ? (
            list.map((r) => (
              <HistoryCard key={String(r._id || r.id)} record={r} onEdit={startEdit} onDelete={onDelete} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
              No medical history records yet.
            </div>
          )}
        </div>
      </div>

      {addOpen ? (
        <div className="rounded-2xl border bg-orange-500/10 p-4 shadow-sm">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Add Medical Record</div>
          <div className="text-sm font-semibold text-foreground mt-1">Record diagnosis, treatment, and notes</div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={form.recordType}
              onChange={(e) => setForm((p) => ({ ...p, recordType: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {recordTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title (e.g., Asthma)" />
            <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            <Input value={form.treatment} onChange={(e) => setForm((p) => ({ ...p, treatment: e.target.value }))} placeholder="Treatment (optional)" />
          </div>

          <div className="mt-3">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={handleSubmitAdd} disabled={busy || !form.title.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </div>
      ) : null}

      {editId ? (
        <div className="rounded-2xl border bg-indigo-500/10 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit Medical Record</div>
              <div className="text-sm font-semibold text-foreground mt-1">Update diagnosis, treatment, or notes</div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={busy} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={editForm.recordType}
              onChange={(e) => setEditForm((p) => ({ ...p, recordType: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {recordTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" />
            <Input type="date" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} />
            <Input value={editForm.treatment} onChange={(e) => setEditForm((p) => ({ ...p, treatment: e.target.value }))} placeholder="Treatment (optional)" />
          </div>

          <div className="mt-3">
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={handleSubmitEdit} disabled={busy || !editForm.title.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

