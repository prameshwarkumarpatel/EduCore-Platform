"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Users } from "lucide-react";

export default function ContactDetailsForm({ value, onChange }) {
  const v = value || {};
  const addr = v.address || {};
  const g = v.guardian || {};

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm space-y-4">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Contact Details</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-300" /> Email
          </div>
          <Input value={v.email || ""} onChange={(e) => onChange?.({ ...v, email: e.target.value })} placeholder="student@example.com" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-300" /> Phone
          </div>
          <Input value={v.phone || ""} onChange={(e) => onChange?.({ ...v, phone: e.target.value })} placeholder="+1 (555)..." />
        </div>

        <div className="space-y-1 md:col-span-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-300" /> Address
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input value={addr.street || ""} onChange={(e) => onChange?.({ ...v, address: { ...addr, street: e.target.value } })} placeholder="Street" />
            <Input value={addr.city || ""} onChange={(e) => onChange?.({ ...v, address: { ...addr, city: e.target.value } })} placeholder="City" />
            <Input value={addr.state || ""} onChange={(e) => onChange?.({ ...v, address: { ...addr, state: e.target.value } })} placeholder="State" />
            <Input value={addr.zip || ""} onChange={(e) => onChange?.({ ...v, address: { ...addr, zip: e.target.value } })} placeholder="Zip" />
            <Input value={addr.country || ""} onChange={(e) => onChange?.({ ...v, address: { ...addr, country: e.target.value } })} placeholder="Country" />
          </div>
        </div>

        <div className="space-y-1 md:col-span-2 pt-2 border-t border-border/50">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-300" /> Guardian
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input value={g.name || ""} onChange={(e) => onChange?.({ ...v, guardian: { ...g, name: e.target.value } })} placeholder="Guardian name" />
            <Input value={g.phone || ""} onChange={(e) => onChange?.({ ...v, guardian: { ...g, phone: e.target.value } })} placeholder="Guardian phone" />
            <Input value={g.email || ""} onChange={(e) => onChange?.({ ...v, guardian: { ...g, email: e.target.value } })} placeholder="Guardian email" />
          </div>
        </div>
      </div>
    </div>
  );
}

