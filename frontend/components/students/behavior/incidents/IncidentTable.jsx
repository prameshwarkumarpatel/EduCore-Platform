"use client";
import React from "react";
import IncidentRow from "./IncidentRow";

export default function IncidentTable({ incidents = [], selectedIncidentId, onSelect }) {
  const list = Array.isArray(incidents) ? incidents : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Incident Logs</div>
          <div className="text-sm font-semibold text-foreground mt-1">{list.length} incidents</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Student</th>
              <th className="px-5 py-3 font-bold">Enrollment</th>
              <th className="px-5 py-3 font-bold">Category</th>
              <th className="px-5 py-3 font-bold">Severity</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((it) => (
                <IncidentRow
                  key={it.id}
                  item={it}
                  selected={String(it.id) === String(selectedIncidentId || "")}
                  onClick={onSelect}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No incidents found for selected filters/date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

