"use client";
import React from "react";
import { Input } from "@/components/ui/input";

export default function EditableField({ label, value, onChange, editing }) {
  if (!editing) {
    return (
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground">{value || "—"}</div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <Input value={value || ""} onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
}
