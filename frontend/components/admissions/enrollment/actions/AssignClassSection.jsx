"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function AssignClassSection({ classes, current, onAssign, disabled }) {
  const [cls, setCls] = useState("");
  const [sec, setSec] = useState("");

  useEffect(() => {
    setCls(current?.assignedClass || "");
    setSec(current?.assignedSection || "");
  }, [current?.id]); // only when selection changes

  const sections = useMemo(() => {
    const found = classes?.find((c) => c.name === cls);
    return found?.sections || [];
  }, [classes, cls]);

  const canSave = Boolean(current?.id && cls && sec);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Class & Section Assignment</div>

      {!current ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          Select an enrollment record to assign class and section.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={cls}
              onChange={(e) => {
                setCls(e.target.value);
                setSec("");
              }}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={disabled}
            >
              <option value="">Select class</option>
              {(classes || []).map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sec}
              onChange={(e) => setSec(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={disabled || !cls}
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end">
            <Button
              onClick={() => onAssign?.({ assignedClass: cls, assignedSection: sec })}
              disabled={disabled || !canSave}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Assignment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

