"use client";
import React from "react";
import LeaveRequestRow from "./LeaveRequestRow";

export default function LeaveRequestTable({ items = [], selectedId, onSelect }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Leave Requests</div>
          <div className="text-sm font-semibold text-foreground mt-1">{list.length} requests</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Student</th>
              <th className="px-5 py-3 font-bold">Enrollment</th>
              <th className="px-5 py-3 font-bold">Dates</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((it) => (
                <LeaveRequestRow key={it.id} item={it} selected={String(it.id) === String(selectedId || "")} onSelect={onSelect} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

