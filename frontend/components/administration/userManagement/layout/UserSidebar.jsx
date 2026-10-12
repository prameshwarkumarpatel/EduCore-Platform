"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck, Contact, Shield, User, Users } from "lucide-react";

const SECTIONS = [
  { id: "list", label: "User List", icon: Users, tone: "from-sky-500 to-indigo-600" },
  { id: "addEdit", label: "Add / Edit", icon: User, tone: "from-emerald-500 to-lime-500" },
  { id: "roles", label: "Role Assignment", icon: Shield, tone: "from-amber-400 to-yellow-500" },
  { id: "profile", label: "Profile", icon: Contact, tone: "from-fuchsia-500 to-purple-600" },
  { id: "status", label: "Status Control", icon: BadgeCheck, tone: "from-orange-500 to-rose-500" },
];

export default function UserSidebar({ activeSection, onSelectSection }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sticky top-6">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground px-2">Sections</div>
      <div className="mt-3 space-y-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectSection(s.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                isActive ? "border-primary/30 bg-primary/5" : "border-muted hover:bg-muted/40"
              )}
            >
              <div className={cn("rounded-xl p-2 text-white shadow bg-gradient-to-br", s.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">Open panel</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

