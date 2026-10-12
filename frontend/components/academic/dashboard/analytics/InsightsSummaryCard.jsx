"use client";
import React from "react";

export default function InsightsSummaryCard({ insights }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Key Insights</div>
      <ul className="mt-3 space-y-2 text-sm">
        <li>Curriculum: <span className="font-semibold">{insights?.curriculumPercent ?? 0}%</span> complete</li>
        <li>Homework submissions: <span className="font-semibold">{insights?.homeworkCompletionPercent ?? 0}%</span></li>
        <li>Lesson plans published: <span className="font-semibold">{insights?.lessonPublishedPercent ?? 0}%</span></li>
      </ul>
    </div>
  );
}
