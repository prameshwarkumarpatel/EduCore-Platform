"use client";
import React from "react";
import { GraduationCap, Mail, Phone } from "lucide-react";
import RelationshipBadge from "../list/RelationshipBadge";

export default function StudentDetailCard({ student }) {
  if (!student) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-400/30 bg-violet-500/5 p-6 text-center text-sm text-muted-foreground">
        Select a student to view details
      </div>
    );
  }
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
          <GraduationCap className="h-7 w-7 text-violet-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-foreground">{student.name || "-"}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <RelationshipBadge type={student.relationshipType} />
            <span className="text-xs text-muted-foreground">{student.enrollmentId || "-"}</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {student.assignedClass && <div>{student.assignedClass} {student.assignedSection ? "/ " + student.assignedSection : ""}</div>}
            {student.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</div>}
            {student.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
