"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ClassSectionAssignment({ classes, value, onAssign, disabled }) {
  const [cls, setCls] = useState(value?.assignedClass || "");
  const [sec, setSec] = useState(value?.assignedSection || "");

  useEffect(() => {
    setCls(value?.assignedClass || "");
    setSec(value?.assignedSection || "");
  }, [value?.assignedClass, value?.assignedSection]);

  const sections = useMemo(() => {
    const found = (classes || []).find((c) => c.name === cls);
    return found?.sections || [];
  }, [classes, cls]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
        Class &amp; Section Assignment
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Class</div>
          <select
            disabled={disabled}
            value={cls}
            onChange={(e) => {
              setCls(e.target.value);
              setSec("");
            }}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select class</option>
            {(classes || []).map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Section</div>
          <select
            disabled={disabled || !cls}
            value={sec}
            onChange={(e) => setSec(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button
            disabled={disabled || !cls || !sec}
            onClick={() => onAssign({ assignedClass: cls, assignedSection: sec })}
            className="w-full md:w-auto"
          >
            Assign
          </Button>
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground">
        Assignment is mandatory before approving the application.
      </div>
    </div>
  );
}

