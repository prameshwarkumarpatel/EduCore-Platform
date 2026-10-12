"use client";
import React from "react";
import { Mail, Phone } from "lucide-react";

export default function ContactInfoSection({ student }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact</div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Mail className="h-4 w-4 text-sky-300" />
          <span className="truncate">{student?.email || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Phone className="h-4 w-4 text-emerald-300" />
          <span>{student?.phone || "—"}</span>
        </div>
      </div>
    </div>
  );
}

