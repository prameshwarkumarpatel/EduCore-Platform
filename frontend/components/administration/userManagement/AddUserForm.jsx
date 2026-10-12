"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

export default function AddUserForm({ roles = [], onCancel, onSubmit, loading }) {
  const roleOptions = useMemo(() => roles.map((r) => r.name), [roles]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: roleOptions[0] || "Student",
  });
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
    } catch (err) {
      setError(err?.message || "Failed to create user.");
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Add User</div>
          <div className="text-lg font-extrabold tracking-tight text-foreground">Create a new account</div>
        </div>
        <Button variant="outline" size="icon" onClick={onCancel} disabled={loading} title="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error ? (
          <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-1">Name</div>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-1">Email</div>
            <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="user@school.edu" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-1">Contact</div>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 9xxxx xxxxx" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-1">Role</div>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {(roleOptions.length ? roleOptions : ["Admin", "Teacher", "Staff", "Student", "Parent"]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}

