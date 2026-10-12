"use client";
import React from "react";
import SubjectClassBadge from "./SubjectClassBadge";
import ReassignClassButton from "../adjustment/ReassignClassButton";

export default function WorkloadRow({ item, onReassign }) {
  return (
    <div className="rounded-xl border bg-card/40 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.department}</div>
        </div>
        <div className={`text-xs font-semibold ${item.workloadLevel === "Overloaded" ? "text-rose-300" : item.workloadLevel === "Underloaded" ? "text-amber-300" : "text-emerald-300"}`}>
          {item.teachingHours}h / {item.targetHours}h
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {(item.tags || []).map((t) => <SubjectClassBadge key={t} text={t} />)}
      </div>
      <div className="text-xs text-muted-foreground">Classes {item.classesCount} · Subjects {item.subjectsCount} · Allocations {item.totalAllocations}</div>
      <ReassignClassButton onClick={() => onReassign?.(item)} />
    </div>
  );
}

