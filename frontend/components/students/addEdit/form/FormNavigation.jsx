"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function FormNavigation({ steps, current, onChange }) {
  return (
    <div className="rounded-2xl border bg-card p-3 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground px-2 pb-2">Steps</div>
      <div className="space-y-1">
        {steps.map((s, idx) => {
          const active = idx === current;
          const done = idx < current;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange?.(idx)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active ? "bg-primary/10 text-primary" : "hover:bg-muted/40 text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-black border",
                  done ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20" : active ? "bg-primary/15 text-primary border-primary/20" : "bg-background text-muted-foreground border-border"
                )}
              >
                {idx + 1}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{s.label}</div>
                <div className="text-[11px] opacity-80">{s.hint}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

