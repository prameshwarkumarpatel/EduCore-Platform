"use client";
import React, { useMemo } from "react";
import { GraduationCap } from "lucide-react";

export default function AcademicDetailsForm({ value, onChange, classes }) {
  const v = value || {};
  const list = Array.isArray(classes) ? classes : [];
  const sections = useMemo(() => {
    const c = list.find((x) => x.name === v.assignedClass);
    return c?.sections || [];
  }, [list, v.assignedClass]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic Details</div>
        <GraduationCap className="h-4 w-4 text-amber-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Grade / Class *</div>
          <select
            value={v.assignedClass || ""}
            onChange={(e) => onChange?.({ ...v, assignedClass: e.target.value, assignedSection: "" })}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select class</option>
            {list.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">Section *</div>
          <select
            value={v.assignedSection || ""}
            onChange={(e) => onChange?.({ ...v, assignedSection: e.target.value })}
            disabled={!v.assignedClass}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <div className="text-xs font-semibold text-muted-foreground">Enrollment ID (auto)</div>
          <input
            value={v.enrollmentId || "Auto-generated on save"}
            readOnly
            className="h-9 w-full rounded-md border border-input bg-muted/30 px-3 text-xs text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}

