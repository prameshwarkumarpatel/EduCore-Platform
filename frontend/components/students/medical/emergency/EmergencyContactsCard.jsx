"use client";
import React, { useState } from "react";
import ContactInfoRow from "./ContactInfoRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save } from "lucide-react";

export default function EmergencyContactsCard({ items = [], onAdd, onDelete, busy }) {
  const list = Array.isArray(items) ? items : [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    relationship: "Guardian",
    notes: "",
  });

  const submit = async () => {
    if (!form.name.trim()) return alert("name is required");
    if (!form.phone.trim()) return alert("phone is required");
    await onAdd?.({
      name: form.name,
      phone: form.phone,
      relationship: form.relationship,
      notes: form.notes,
    });
    setForm({ name: "", phone: "", relationship: "Guardian", notes: "" });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Emergency Contacts</div>
            <div className="text-sm font-semibold text-foreground mt-1">{list.length} contacts</div>
          </div>
        </div>

        <div className="space-y-3">
          {list.length ? (
            list.map((c) => <ContactInfoRow key={String(c._id || c.id)} contact={c} onDelete={onDelete} disabled={busy} />)
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
              No emergency contacts.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-red-500/10 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Add Emergency Contact</div>
            <div className="text-sm font-semibold text-foreground mt-1">Quick access for emergencies</div>
          </div>
          <Plus className="h-5 w-5 text-red-300" />
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Contact name" />
          <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
          <select
            value={form.relationship}
            onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Guardian">Guardian</option>
            <option value="Parent">Parent</option>
            <option value="Relative">Relative</option>
            <option value="Other">Other</option>
          </select>
          <Input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes (optional)" />
        </div>

        <div className="mt-3 flex justify-end">
          <Button onClick={submit} disabled={busy || !form.name.trim() || !form.phone.trim()} className="gap-2">
            <Save className="h-4 w-4" />
            {busy ? "Saving..." : "Add Contact"}
          </Button>
        </div>
      </div>
    </div>
  );
}

