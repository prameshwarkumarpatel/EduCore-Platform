"use client";
import React from "react";

export default function LinkedStudentsCard({ parents = [], selectedParentId, onSelectParent }) {
  const list = Array.isArray(parents) ? parents : [];

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Linked Students</div>
          <div className="text-sm font-semibold text-foreground mt-1">Parent → students mapping</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2 text-xs text-muted-foreground">
          {list.length} parents
        </div>
      </div>

      <div className="rounded-xl border bg-background/30 overflow-hidden">
        {list.length ? (
          <div className="max-h-72 overflow-y-auto">
            {list.map((p) => {
              const active = selectedParentId && p.id === selectedParentId;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => onSelectParent?.(p)}
                  className={`w-full px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                    active ? "bg-emerald-500/15 border-emerald-500/30" : "hover:bg-muted/30 border-border/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{p.name}</div>
                      <div className="text-[12px] text-muted-foreground truncate">
                        {p.email || p.phone || "—"} · {p.relationship || "Guardian"}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(p.sampleStudents || []).map((s) => (
                          <span
                            key={s.id}
                            className="text-[12px] rounded-full border bg-background/50 px-2 py-1 text-muted-foreground"
                          >
                            {s.name}
                          </span>
                        ))}
                        {p.studentsCount > (p.sampleStudents || []).length ? (
                          <span className="text-[12px] rounded-full border bg-muted/30 px-2 py-1 text-muted-foreground">
                            +{p.studentsCount - (p.sampleStudents || []).length} more
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs rounded-xl border bg-background/50 px-3 py-2">
                      {p.studentsCount} child{p.studentsCount === 1 ? "" : "ren"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">No linked parent data yet.</div>
        )}
      </div>
    </div>
  );
}

