"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function RoleRestrictionsPanel({ role, onUpdateRestrictions, loading }) {
  const [branches, setBranches] = useState(() => (role?.restrictions?.branches || []).join(", "));
  const [notes, setNotes] = useState(() => role?.restrictions?.notes || "");

  if (!role) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-5 text-sm text-muted-foreground">
        Select a role to configure advanced restrictions.
      </div>
    );
  }

  const handleSave = () => {
    const list = branches
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    onUpdateRestrictions(role.id, { branches: list, notes });
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Role Restrictions</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Advanced security boundaries</div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Branch‑level access</div>
          <Input
            value={branches}
            onChange={(e) => setBranches(e.target.value)}
            placeholder="e.g. North Campus, East Wing"
          />
          <div className="mt-1 text-[11px] text-muted-foreground">
            Comma‑separated list of branches this role is allowed to access. Leave empty for global access.
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Restriction notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Document any special rules, exemptions, or risk notes."
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-3">
        <Button
          disabled={loading}
          onClick={handleSave}
          className="gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-400 hover:to-rose-400"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save restrictions"}
        </Button>
      </div>
    </div>
  );
}

