"use client";
import React from "react";
import SubjectRow from "./SubjectRow";

export default function SubjectPerformanceTable({ subjects }) {
  const rows = Array.isArray(subjects) ? subjects : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Subject-wise Performance</div>
        <div className="text-xs text-muted-foreground">{rows.length} subjects</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Subject</th>
              <th className="px-5 py-3 font-bold">Attempts</th>
              <th className="px-5 py-3 font-bold">Avg Marks</th>
              <th className="px-5 py-3 font-bold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((r) => <SubjectRow key={r.subject} row={r} />)
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No subject performance data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

