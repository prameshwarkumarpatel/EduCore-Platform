"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import ProfileAvatar from "../overview/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

function toDateInputValue(dob) {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function ProfileForm({ draft, onChange }) {
  const v = draft || {};
  const [localPhotoBusy, setLocalPhotoBusy] = useState(false);

  const set = (patch) => onChange?.({ ...v, ...patch });
  const addr = v.address || {};
  const guardian = v.guardian || {};

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPhotoBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      set({ photoUrl: dataUrl });
    } finally {
      setLocalPhotoBusy(false);
    }
  };

  const steps = useMemo(() => 1, []);

  return (
    <div className="space-y-4" key={steps}>
      <div className="rounded-2xl border bg-gradient-to-br from-sky-500/20 via-indigo-600/25 to-blue-800/30 p-5 shadow-sm">
        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar student={v} />
            <div className="min-w-0">
              <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">
                Edit Student Profile
              </div>
              <div className="text-sm text-blue-100/90 mt-1">
                Make changes and click <span className="font-bold">Save Changes</span>.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-photo-upload"
              onChange={onPickPhoto}
            />
            <label htmlFor="profile-photo-upload">
              <Button type="button" disabled={localPhotoBusy} className="gap-2">
                <Upload className="h-4 w-4" />
                {localPhotoBusy ? "Uploading..." : "Upload Photo"}
              </Button>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-4 shadow-sm space-y-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Personal</div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Name *</div>
            <Input value={v.name || ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">DOB</div>
            <Input type="date" value={toDateInputValue(v.dob)} onChange={(e) => set({ dob: e.target.value })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Gender</div>
            <select
              value={v.gender || ""}
              onChange={(e) => set({ gender: e.target.value })}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Status</div>
            <select
              value={v.status || "Active"}
              onChange={(e) => set({ status: e.target.value })}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm space-y-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic</div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Grade/Class *</div>
            <Input value={v.assignedClass || ""} onChange={(e) => set({ assignedClass: e.target.value, assignedSection: v.assignedSection })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Section *</div>
            <Input value={v.assignedSection || ""} onChange={(e) => set({ assignedSection: e.target.value })} />
          </div>
          <div className="text-xs text-muted-foreground pt-1">
            Enrollment ID is read-only: <span className="font-semibold">{v.enrollmentId || "—"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm space-y-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Contact</div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Email</div>
            <Input value={v.email || ""} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Phone</div>
            <Input value={v.phone || ""} onChange={(e) => set({ phone: e.target.value })} />
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-sky-500/15 to-cyan-500/10 p-4 shadow-sm space-y-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Guardian</div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Guardian name</div>
            <Input value={guardian?.name || ""} onChange={(e) => set({ guardian: { ...guardian, name: e.target.value } })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Guardian phone</div>
            <Input value={guardian?.phone || ""} onChange={(e) => set({ guardian: { ...guardian, phone: e.target.value } })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Guardian email</div>
            <Input value={guardian?.email || ""} onChange={(e) => set({ guardian: { ...guardian, email: e.target.value } })} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm space-y-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Address</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <Input value={addr?.street || ""} onChange={(e) => set({ address: { ...addr, street: e.target.value } })} placeholder="Street" className="md:col-span-2" />
          <Input value={addr?.city || ""} onChange={(e) => set({ address: { ...addr, city: e.target.value } })} placeholder="City" />
          <Input value={addr?.state || ""} onChange={(e) => set({ address: { ...addr, state: e.target.value } })} placeholder="State" />
          <Input value={addr?.zip || ""} onChange={(e) => set({ address: { ...addr, zip: e.target.value } })} placeholder="Zip" />
          <Input value={addr?.country || ""} onChange={(e) => set({ address: { ...addr, country: e.target.value } })} placeholder="Country" />
        </div>
      </div>
    </div>
  );
}

