"use client";
import React, { useMemo } from "react";

export default function ClassSectionSelector({ classes = [], className, section, onChange }) {
  const sections = useMemo(() => {
    const c = classes.find((x) => x.name === className);
    return c?.sections || [];
  }, [classes, className]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <select value={className || ""} onChange={(e) => onChange?.({ className: e.target.value, section: "" })} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Class</option>
        {classes.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      <select value={section || ""} onChange={(e) => onChange?.({ className, section: e.target.value })} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Section</option>
        {sections.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

