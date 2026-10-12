"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import SemesterItem from "./SemesterItem";
import { Plus } from "lucide-react";

export default function SemesterConfigPanel({ semesters, onChange }) {
  const addSemester = () => {
    onChange([
      ...semesters,
      { name: `Term ${semesters.length + 1}`, startDate: "", endDate: "" },
    ]);
  };

  const updateOne = (index, sem) => {
    const copy = [...semesters];
    copy[index] = sem;
    onChange(copy);
  };

  const removeOne = (index) => {
    const copy = semesters.filter((_, i) => i !== index);
    onChange(copy);
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Semesters / Terms
          </div>
          <div className="text-lg font-extrabold tracking-tight text-foreground">
            Structure the academic year
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1 bg-purple-500 text-white hover:bg-purple-400"
          onClick={addSemester}
        >
          <Plus className="h-4 w-4" />
          Add term
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {semesters.map((s, idx) => (
          <SemesterItem
            key={idx}
            semester={s}
            onChange={(next) => updateOne(idx, next)}
            onRemove={() => removeOne(idx)}
          />
        ))}
        {semesters.length === 0 ? (
          <div className="text-xs text-purple-100/80 border border-dashed border-purple-400/40 rounded-xl p-4">
            No terms configured yet. Click <span className="font-semibold">Add term</span> to begin.
          </div>
        ) : null}
      </div>
    </div>
  );
}

