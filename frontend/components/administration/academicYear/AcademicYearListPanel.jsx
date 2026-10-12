"use client";
import React from "react";
import AcademicYearCard from "./AcademicYearCard";

export default function AcademicYearListPanel({ years, selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Year List</div>
      <div className="text-sm text-muted-foreground mt-1">
        Total: <span className="font-semibold text-foreground">{years.length}</span>
      </div>

      <div className="mt-4 space-y-3 max-h-[760px] overflow-y-auto pr-2 custom-scrollbar">
        {years.map((y) => (
          <AcademicYearCard key={y.id} year={y} selected={y.id === selectedId} onSelect={onSelect} />
        ))}
        {years.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground border-2 border-dashed rounded-2xl p-10 bg-muted/10">
            No academic years found. Create one to start planning.
          </div>
        ) : null}
      </div>
    </div>
  );
}

