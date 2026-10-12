"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function UserProfilePanel({ user, onUpdateProfile, loading }) {
  const [form, setForm] = useState(() => ({
    address: user?.profile?.address || "",
    avatarUrl: user?.profile?.avatarUrl || "",
    bio: user?.profile?.bio || "",
  }));

  if (!user) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 p-5 text-sm text-muted-foreground">
        Select a user to manage profile fields.
      </div>
    );
  }

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">User Profile</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Profile details</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Address</div>
          <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address / Location" />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Avatar URL</div>
          <Input value={form.avatarUrl} onChange={(e) => update("avatarUrl", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Bio</div>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Short description..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-3">
        <Button
          disabled={loading}
          onClick={() => onUpdateProfile(user.id, { profile: { ...form } })}
          className="gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:from-fuchsia-400 hover:to-purple-500"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}

