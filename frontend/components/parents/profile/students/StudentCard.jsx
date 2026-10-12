"use client";
import React from "react";
import Link from "next/link";

export default function StudentCard({ student }) {
  if (!student) return null;
  return (
    <div className="rounded-xl border border-border/40 bg-background/30 px-3 py-2 flex items-center justify-between hover:bg-muted/20 transition-colors">
      <div className="min-w-0">
        <div className="font-semibold text-foreground truncate">{student.name || "—"}</div>
        <div className="text-xs text-muted-foreground truncate">
          {student.enrollmentId || ""} · {student.assignedClass || ""}{" "}
          {student.assignedSection ? `/ ${student.assignedSection}` : ""}
        </div>
      </div>
      <Link
        href={`/students/profile?id=${student.id}`}
        className="text-xs text-primary hover:underline shrink-0"
      >
        View
      </Link>
    </div>
  );
}
