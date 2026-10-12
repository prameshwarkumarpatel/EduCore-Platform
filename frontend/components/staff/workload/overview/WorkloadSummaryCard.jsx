"use client";
import React from "react";

export default function WorkloadSummaryCard({ summary }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Workload Summary</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Teachers <span className="font-semibold text-foreground">{summary?.totalTeachers || 0}</span> ·
        Classes <span className="font-semibold text-foreground">{summary?.totalClasses || 0}</span> ·
        Subjects <span className="font-semibold text-foreground">{summary?.totalSubjects || 0}</span>
      </div>
    </div>
  );
}

