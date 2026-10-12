"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import FilePreview from "./FilePreview";

export default function ProfilePhotoUpload({ photoUrl, onChange }) {
  const ref = useRef(null);
  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    const r = new FileReader();
    r.onloadend = () => onChange?.(String(r.result || ""));
    r.readAsDataURL(file);
  };
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-violet-100/80">Profile Photo Upload</div>
      <div className="mt-3 flex items-center gap-4">
        <FilePreview src={photoUrl} />
        <div className="space-y-2">
          <input ref={ref} type="file" accept="image/jpeg,image/jpg,image/png" className="hidden" onChange={onPick} />
          <Button type="button" onClick={() => ref.current?.click()} size="sm">Upload Photo</Button>
          <div className="text-[11px] text-muted-foreground">JPG/PNG, max 2MB</div>
        </div>
      </div>
    </div>
  );
}

