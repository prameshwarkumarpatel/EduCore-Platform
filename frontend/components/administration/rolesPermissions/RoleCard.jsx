"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Layers3, ShieldCheck } from "lucide-react";

export default function RoleCard({ role, selected, onSelect }) {
  const modules = role.modules || [];
  const permsCount = role.permissions?.length || 0;

  return (
    <button
      onClick={() => onSelect(role)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md",
        selected ? "border-primary/40 bg-primary/5" : "border-muted bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl grid place-items-center text-white shadow bg-gradient-to-br from-sky-500 to-indigo-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate">
              <div className="font-bold text-foreground truncate">{role.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {role.description || "No description configured"}
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-sky-500">
              {modules.length} modules
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {modules.slice(0, 3).map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full border border-sky-300/40 bg-sky-500/5 px-2 py-0.5"
              >
                <Layers3 className="h-3 w-3 text-sky-400" />
                <span className="font-medium text-foreground">{m}</span>
              </span>
            ))}
            {modules.length > 3 ? (
              <span className="text-xs text-muted-foreground">+{modules.length - 3} more</span>
            ) : null}
            <span className="ml-auto text-xs text-muted-foreground">{permsCount} permissions</span>
          </div>
        </div>
      </div>
    </button>
  );
}

