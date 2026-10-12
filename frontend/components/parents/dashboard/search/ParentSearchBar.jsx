"use client";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ParentSearchBar({ value, onChange, results, onSelect }) {
  const [open, setOpen] = useState(false);

  const show = useMemo(() => Array.isArray(results) && results.length > 0 && open && String(value || "").trim().length > 0, [
    results,
    open,
    value,
  ]);

  return (
    <div className="relative">
      <div className="relative md:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="parent-search"
          value={value}
          onChange={(e) => {
            // Close dropdown while typing; it will reopen when results arrive.
            setOpen(false);
            onChange(e.target.value);
          }}
          placeholder="Search parents..."
          className="pl-10"
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // allow click on dropdown
            setTimeout(() => setOpen(false), 160);
          }}
        />
      </div>

      {show ? (
        <div className="absolute z-30 mt-2 w-full rounded-xl border bg-background shadow-lg overflow-hidden">
          <div className="p-3 border-b text-xs font-black tracking-widest uppercase text-muted-foreground bg-muted/20">
            Quick lookup
          </div>
          <div className="max-h-60 overflow-y-auto">
            {results.map((r) => (
              <button
                type="button"
                key={r.id}
                className="w-full px-3 py-2 text-left hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect?.(r)}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{r.name}</div>
                  <div className="text-[12px] text-muted-foreground truncate">
                    {r.email || r.phone || "—"} · {r.relationship || "Guardian"}
                  </div>
                </div>
                <div className="text-xs rounded-lg border px-2 py-1 bg-muted/30 shrink-0">{r.studentsCount ?? 0} students</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

