"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Layers3, Shield, Sparkles, Table2, TrafficCone } from "lucide-react";

const SECTIONS = [
  { id: "list", label: "Roles List", icon: Layers3, tone: "from-sky-500 to-indigo-600" },
  { id: "edit", label: "Create / Edit", icon: Sparkles, tone: "from-emerald-500 to-lime-500" },
  { id: "matrix", label: "Permission Matrix", icon: Table2, tone: "from-fuchsia-500 to-purple-600" },
  { id: "modules", label: "Module Access", icon: Shield, tone: "from-amber-400 to-yellow-500" },
  { id: "restrictions", label: "Restrictions", icon: TrafficCone, tone: "from-orange-500 to-rose-500" },
];

export default function RolesSidebar({ activeSection, onSelectSection }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sticky top-6">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground px-2">Security Zones</div>
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

