"use client";
import React from "react";
import { Calendar, Mail, MapPin, Phone, ShieldCheck, User2 } from "lucide-react";

export default function ViewUserDetails({ user }) {
  if (!user) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        Select a user to view details.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">User Details</div>
          <div className="text-2xl font-extrabold tracking-tight text-foreground mt-1">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</div>
          <div className={user.isActive ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
            {user.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Role
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">{user.role}</div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-muted-foreground">
            <User2 className="h-4 w-4" /> Contact
          </div>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-foreground font-medium">{user.email}</span>
            </div>
            {user.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-foreground font-medium">{user.phone}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-muted-foreground">
            <MapPin className="h-4 w-4" /> Address
          </div>
          <div className="mt-1 text-sm text-foreground font-medium">{user.profile?.address || "—"}</div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-muted-foreground">
            <Calendar className="h-4 w-4" /> Activity
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Created: <span className="text-foreground font-medium">{new Date(user.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: <span className="text-foreground font-medium">{new Date(user.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

