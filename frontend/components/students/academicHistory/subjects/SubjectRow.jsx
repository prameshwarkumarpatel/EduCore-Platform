"use client";
import React from "react";
import GradeBadge from "../overview/GradeBadge";

export default function SubjectRow({ row }) {
  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="px-5 py-3 text-sm font-semibold text-foreground">{row.subject}</td>
      <td className="px-5 py-3 text-sm text-muted-foreground">{row.occurrences} exams</td>
      <td className="px-5 py-3 text-sm font-bold text-foreground">{row.avgMarks}</td>
      <td className="px-5 py-3">
        <GradeBadge grade={row.grade} />
      </td>
    </tr>
  );
}

