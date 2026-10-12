"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function EditUserForm({ user, roles = [], onSubmit, loading }) {
  const roleOptions = useMemo(() => roles.map((r) => r.name), [roles]);
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || roleOptions[0] || "Student",
  }));
  const [error, setError] = useState("");

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?.id) return;
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    try {
      await onSubmit(user.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
      });
    } catch (err) {
      setError(err?.message || "Failed to update user.");
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 text-sm text-muted-foreground">
        Select a user to edit.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit User</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Update account details</div>
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

        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
          >
            <Save className="h-4 w-4" />
            {loading ? "Updating..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

