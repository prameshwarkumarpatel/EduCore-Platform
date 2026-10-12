"use client";
import React, { useMemo } from "react";
import { CalendarDays } from "lucide-react";

function toISO(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function DateFilter({ value, onChange }) {
  const { start, end } = value || {};
  const presets = useMemo(() => {
    const now = new Date();
    const endD = toISO(now);
    const last30 = toISO(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
    const last90 = toISO(new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000));
    return [
      { id: "30", label: "Last 30 days", start: last30, end: endD },
      { id: "90", label: "Last 90 days", start: last90, end: endD },
    ];
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        Date range
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          value={start || ""}
          onChange={(e) => onChange?.({ start: e.target.value, end })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <input
          type="date"
          value={end || ""}
          onChange={(e) => onChange?.({ start, end: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <select
          defaultValue=""
          onChange={(e) => {
            const p = presets.find((x) => x.id === e.target.value);
            if (p) onChange?.({ start: p.start, end: p.end });
          }}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Presets
          </option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

