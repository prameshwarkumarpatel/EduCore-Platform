"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ImagePreview from "./ImagePreview";

export default function ProfilePhotoUpload({ value, onChange, uploading }) {
  const ref = useRef(null);
  const [local, setLocal] = useState("");

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFile(file);
    setLocal(dataUrl);
    onChange?.(dataUrl);
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Profile Photo</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        <ImagePreview src={local || value} />
        <div className="rounded-xl border border-border/60 bg-background/40 p-3 space-y-2">
          <div className="text-sm font-semibold text-foreground">Upload student photo</div>
          <div className="text-xs text-muted-foreground">JPG/PNG recommended. Stored as a data URL for now.</div>
          <Button
            type="button"
            variant="outline"
            className="gap-2 w-full"
            disabled={uploading}
            onClick={() => ref.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Choose Image"}
          </Button>
          <input ref={ref} type="file" className="hidden" accept="image/*" onChange={onPick} />
        </div>
      </div>
    </div>
  );
}

