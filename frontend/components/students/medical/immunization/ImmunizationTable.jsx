"use client";
import React, { useState } from "react";
import VaccineStatusBadge from "./VaccineStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2, Pencil, X } from "lucide-react";

function normalizeDateValue(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function ImmunizationTable({ items = [], onAdd, onUpdate, onDelete, busy }) {
  const list = Array.isArray(items) ? items : [];

  const [addOpen, setAddOpen] = useState(true);
  const [form, setForm] = useState({
    vaccineName: "",
    status: "Pending",
    administeredDate: "",
    dose: "",
    notes: "",
  });

  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({
    vaccineName: "",
    status: "Pending",
    administeredDate: "",
    dose: "",
    notes: "",
  });

  const startEdit = (it) => {
    setEditId(String(it._id || it.id));
    setEditForm({
      vaccineName: it.vaccineName || "",
      status: it.status || "Pending",
      administeredDate: normalizeDateValue(it.administeredDate),
      dose: it.dose || "",
      notes: it.notes || "",
    });
  };

  const cancelEdit = () => setEditId("");

  const submitAdd = async () => {
    if (!form.vaccineName.trim()) return alert("vaccineName is required");
    await onAdd?.({
      vaccineName: form.vaccineName,
      status: form.status,
      administeredDate: form.administeredDate || undefined,
      dose: form.dose,
      notes: form.notes,
    });
    setForm({ vaccineName: "", status: "Pending", administeredDate: "", dose: "", notes: "" });
  };

  const submitEdit = async () => {
    if (!editForm.vaccineName.trim()) return alert("vaccineName is required");
    await onUpdate?.(editId, {
      vaccineName: editForm.vaccineName,
      status: editForm.status,
      administeredDate: editForm.administeredDate || undefined,
      dose: editForm.dose,
      notes: editForm.notes,
    });
    setEditId("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Immunization Records</div>
            <div className="text-sm font-semibold text-foreground mt-1">{list.length} vaccines</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAddOpen((v) => !v)} disabled={busy} className="gap-2">
            <Pencil className="h-4 w-4" />
            {addOpen ? "Collapse" : "Add"}
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-5 py-3 font-bold">Vaccine</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Administered</th>
                <th className="px-5 py-3 font-bold">Dose</th>
                <th className="px-5 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length ? (
                list.map((it) => (
                  <tr key={String(it._id || it.id)} className="border-b last:border-b-0">
                    <td className="px-5 py-3 font-semibold text-foreground">{it.vaccineName}</td>
                    <td className="px-5 py-3">
                      <VaccineStatusBadge status={it.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{it.administeredDate ? normalizeDateValue(it.administeredDate) : "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{it.dose || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(it)} disabled={busy} className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete?.(String(it._id || it.id))}
                          disabled={busy}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No immunizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen ? (
        <div className="rounded-2xl border bg-emerald-500/10 p-4 shadow-sm">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Add Immunization</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={form.vaccineName} onChange={(e) => setForm((p) => ({ ...p, vaccineName: e.target.value }))} placeholder="Vaccine name (e.g., MMR)" />
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
            <Input type="date" value={form.administeredDate} onChange={(e) => setForm((p) => ({ ...p, administeredDate: e.target.value }))} />
            <Input value={form.dose} onChange={(e) => setForm((p) => ({ ...p, dose: e.target.value }))} placeholder="Dose (optional)" />
          </div>
          <div className="mt-3">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={submitAdd} disabled={busy || !form.vaccineName.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : "Add Immunization"}
            </Button>
          </div>
        </div>
      ) : null}

      {editId ? (
        <div className="rounded-2xl border bg-teal-500/10 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit Immunization</div>
              <div className="text-sm font-semibold text-foreground mt-1">Update vaccine details</div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={busy} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={editForm.vaccineName} onChange={(e) => setEditForm((p) => ({ ...p, vaccineName: e.target.value }))} placeholder="Vaccine name" />
            <select
              value={editForm.status}
              onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
            <Input type="date" value={editForm.administeredDate} onChange={(e) => setEditForm((p) => ({ ...p, administeredDate: e.target.value }))} />
            <Input value={editForm.dose} onChange={(e) => setEditForm((p) => ({ ...p, dose: e.target.value }))} placeholder="Dose (optional)" />
          </div>
          <div className="mt-3">
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Notes"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={submitEdit} disabled={busy || !editForm.vaccineName.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              {busy ? "Updating..." : "Update Immunization"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

