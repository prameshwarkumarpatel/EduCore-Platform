"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function EditRoleForm({ role, onSubmit, loading }) {
  const [form, setForm] = useState(() => ({
    name: role?.name || "",
    description: role?.description || "",
  }));
  const [error, setError] = useState("");

  if (!role) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 text-sm text-muted-foreground">
        Select a role to edit.
      </div>
    );
  }

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Role name is required.");
      return;
    }
    try {
      await onSubmit(role.id, {
        name: form.name.trim(),
        description: form.description.trim(),
      });
    } catch (err) {
      setError(err?.message || "Failed to update role.");
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit Role</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Update role details</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error ? (
          <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>
        ) : null}

        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Role name</div>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Admin, Teacher, Staff"
          />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Description</div>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Short description of responsibilities and scope."
          />
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

