"use client";
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Layers3, ShieldCheck } from "lucide-react";

export default function ViewRoleDetails({ role, permissions }) {
  const permsByKey = useMemo(() => {
    const map = new Map();
    (permissions || []).forEach((p) => map.set(p.key, p));
    return map;
  }, [permissions]);

  if (!role) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        Select a role from the left to view its full definition.
      </div>
    );
  }

  const modules = role.modules || [];
  const keys = role.permissions || [];
  const resolvedPerms = keys
    .map((k) => permsByKey.get(k))
    .filter(Boolean)
    .sort((a, b) => a.module.localeCompare(b.module) || a.action.localeCompare(b.action));

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Role Details</div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground mt-1">{role.name}</div>
            <div className="mt-1 text-sm text-muted-foreground max-w-xl">{role.description}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{keys.length} permissions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
              Accessible Modules
            </div>
            <div className="flex flex-wrap gap-2">
              {modules.length === 0 ? (
                <span className="text-xs text-muted-foreground">No modules explicitly granted.</span>
              ) : (
                modules.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 rounded-full border border-sky-300/50 bg-sky-500/5 px-2 py-0.5 text-xs"
                  >
                    <Layers3 className="h-3 w-3 text-sky-400" />
                    <span className="font-medium text-foreground">{m}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
              Restrictions
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                <span className="font-semibold text-foreground">Branches:</span>{" "}
                {role.restrictions?.branches?.length
                  ? role.restrictions.branches.join(", ")
                  : "Global (no branch restriction)"}
              </div>
              <div>
                <span className="font-semibold text-foreground">Notes:</span>{" "}
                {role.restrictions?.notes || "No special notes recorded."}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
            Effective Permissions
          </div>
          {resolvedPerms.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              This role currently has no explicit permissions assigned.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              {resolvedPerms.map((p) => (
                <div
                  key={p.id || p.key}
                  className="flex items-center justify-between gap-2 rounded-lg border border-muted bg-background/40 px-3 py-2"
                >
                  <div className="truncate">
                    <div className="font-semibold text-foreground truncate">
                      {p.module} · {p.action.toUpperCase()}
                    </div>
                    <div className="truncate">{p.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

