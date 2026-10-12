"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const CORE_MODULES = ["Dashboard", "Students", "Teachers", "Administration", "Finance"];

export default function ModuleAccessControl({ modules, onChange, loading }) {
  const current = new Set(modules || []);

  const toggle = (module) => {
    const copy = new Set(current);
    if (copy.has(module)) copy.delete(module);
    else copy.add(module);
    onChange(Array.from(copy));
  };

  const selectAll = () => onChange([...CORE_MODULES]);
  const clearAll = () => onChange([]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Module Access</div>
          <div className="text-lg font-extrabold tracking-tight text-foreground">High‑level access switches</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={selectAll} disabled={loading}>
            All
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll} disabled={loading}>
            None
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {CORE_MODULES.map((m) => {
          const active = current.has(m);
          return (
            <button
              key={m}
              type="button"
              disabled={loading}
              onClick={() => toggle(m)}
              className={
                "rounded-xl px-3 py-2 text-left text-sm border transition-all " +
                (active
                  ? "border-yellow-500 bg-yellow-400 text-amber-950 font-semibold shadow-sm"
                  : "border-amber-200/60 bg-white/70 text-amber-900 hover:bg-amber-50")
              }
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}

