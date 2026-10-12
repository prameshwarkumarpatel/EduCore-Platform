"use client";
import React, { useMemo } from "react";
import PermissionToggle from "./PermissionToggle";

export default function PermissionMatrix({ permissions, selectedKeys, onChange }) {
  const grouped = useMemo(() => {
    const byModule = new Map();
    (permissions || []).forEach((p) => {
      const list = byModule.get(p.module) || [];
      list.push(p);
      byModule.set(p.module, list);
    });
    return Array.from(byModule.entries());
  }, [permissions]);

  const current = new Set(selectedKeys || []);

  const toggle = (key, next) => {
    const copy = new Set(current);
    if (next) copy.add(key);
    else copy.delete(key);
    onChange(Array.from(copy));
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Permission Matrix</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Modules vs. Actions</div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[520px] space-y-4">
          {grouped.map(([module, perms]) => (
            <div key={module} className="rounded-xl border border-purple-500/20 bg-black/10 p-4">
              <div className="text-xs font-black uppercase tracking-widest text-purple-200 flex items-center justify-between">
                <span>{module}</span>
                <span className="text-[10px] opacity-70">
                  {perms.length} permission{perms.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {perms.map((p) => {
                  const key = p.key;
                  const checked = current.has(key);
                  return (
                    <div
                      key={p.id || key}
                      className="flex items-center justify-between gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2"
                    >
                      <div className="text-xs text-purple-50">
                        <div className="font-semibold">{p.action.toUpperCase()}</div>
                        <div className="text-[11px] opacity-80 truncate">{p.label}</div>
                      </div>
                      <PermissionToggle checked={checked} onChange={(next) => toggle(key, next)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {grouped.length === 0 ? (
            <div className="text-sm text-purple-100/80 text-center border border-dashed border-purple-400/40 rounded-2xl p-8">
              No permissions defined yet. They will appear here as a module vs. action grid.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

