"use client";
import React from "react";
import ApprovalRow from "./ApprovalRow";

export default function ApprovalQueueTable({ applications, selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
        Approval Queue
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-muted/80">
            <tr>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Date</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Applicant</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Applied</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications && applications.length ? (
              applications.map((a) => (
                <ApprovalRow
                  key={a.id}
                  app={a}
                  selected={a.id === selectedId}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No applications in the approval queue. Create a new application to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

