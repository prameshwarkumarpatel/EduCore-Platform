"use client";
import React from "react";
import { UsersRound } from "lucide-react";
import ParentStatusBadge from "../table/ParentStatusBadge";
import LinkedStudentsList from "./LinkedStudentsList";

export default function ParentProfileCard({ parent }) {
  if (!parent) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Parent Profile
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-2">
            <UsersRound className="h-4 w-4 text-fuchsia-300" />
          </div>
        </div>
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          Select a parent to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
          Parent Profile
        </div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <UsersRound className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border bg-background/30 p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Parent ID</div>
          <div className="text-sm font-mono text-foreground break-all">{parent.id || "—"}</div>
          <div className="font-extrabold text-foreground truncate mt-2">{parent.name || "—"}</div>
          <div className="flex items-center gap-2 mt-2">
            <ParentStatusBadge status={parent.status} />
          </div>
        </div>
        <div className="rounded-xl border bg-background/30 p-3 space-y-2">
          <div className="text-xs font-bold text-muted-foreground uppercase">Contact</div>
          <div className="text-sm text-foreground truncate">{parent.email || "—"}</div>
          <div className="text-sm text-foreground truncate">{parent.phone || "—"}</div>
          <div className="text-xs text-muted-foreground">{parent.relationship || "Guardian"}</div>
        </div>
        <LinkedStudentsList
          students={
            parent.linkedStudents && parent.linkedStudents.length > 0
              ? parent.linkedStudents
              : parent.sampleStudents || []
          }
        />
      </div>
    </div>
  );
}
