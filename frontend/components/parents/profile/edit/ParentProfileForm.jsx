"use client";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import ProfileAvatar from "../overview/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MAX_PHOTO_SIZE_MB = 2;
const MAX_PHOTO_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function ParentProfileForm({ draft, onChange }) {
  const v = draft || {};
  const fileInputRef = useRef(null);
  const [localPhotoBusy, setLocalPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const set = (patch) => onChange?.({ ...v, ...patch });
  const addr = v.address || {};

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const triggerFileSelect = () => {
    setPhotoError("");
    fileInputRef.current?.click();
  };

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError(`File too large. Maximum size is ${MAX_PHOTO_SIZE_MB}MB.`);
      return;
    }
    setLocalPhotoBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      set({ photoUrl: dataUrl });
    } catch (err) {
      setPhotoError(err?.message || "Failed to read image.");
    } finally {
      setLocalPhotoBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-sky-500/20 via-indigo-600/25 to-blue-800/30 p-5 shadow-sm">
        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar parent={v} />
            <div className="min-w-0">
              <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">
                Edit Parent Profile
              </div>
              <div className="text-sm text-blue-100/90 mt-1">
                Make changes and click <span className="font-bold">Save Changes</span>.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={onPickPhoto}
            />
            <Button
              type="button"
              onClick={triggerFileSelect}
              disabled={localPhotoBusy}
              className="gap-2 shrink-0"
            >
              <Upload className="h-4 w-4" />
              {localPhotoBusy ? "Processing..." : "Upload Photo"}
            </Button>
            <div className="text-[11px] text-blue-100/70">
              JPG or PNG. Max {MAX_PHOTO_SIZE_MB}MB.
            </div>
            {photoError ? (
              <div className="text-xs text-rose-300">{photoError}</div>
            ) : null}
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
            <div className="text-xs font-semibold text-muted-foreground">Relationship</div>
            <Input value={v.relationship || ""} onChange={(e) => set({ relationship: e.target.value })} />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Status</div>
            <select
              value={v.status || "Active"}
              onChange={(e) => set({ status: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm space-y-3">
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
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-4 shadow-sm space-y-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Address</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            value={addr?.street || ""}
            onChange={(e) => set({ address: { ...addr, street: e.target.value } })}
            placeholder="Street"
            className="md:col-span-2"
          />
          <Input
            value={addr?.city || ""}
            onChange={(e) => set({ address: { ...addr, city: e.target.value } })}
            placeholder="City"
          />
          <Input
            value={addr?.state || ""}
            onChange={(e) => set({ address: { ...addr, state: e.target.value } })}
            placeholder="State"
          />
          <Input
            value={addr?.zip || ""}
            onChange={(e) => set({ address: { ...addr, zip: e.target.value } })}
            placeholder="Zip"
          />
          <Input
            value={addr?.country || ""}
            onChange={(e) => set({ address: { ...addr, country: e.target.value } })}
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );
}
