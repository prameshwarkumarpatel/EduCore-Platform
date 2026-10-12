"use client";
import React from "react";
import ParentRow from "./ParentRow";

export default function ParentTable({ parents, selectedId, onSelect, onView, onEdit, onDelete }) {
  const list = Array.isArray(parents) ? parents : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/15 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
          Parent List
        </div>
        <div className="text-xs text-muted-foreground">{list.length} parents</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Parent ID</th>
              <th className="px-5 py-3 font-bold">Name</th>
              <th className="px-5 py-3 font-bold">Email</th>
              <th className="px-5 py-3 font-bold">Phone</th>
              <th className="px-5 py-3 font-bold">Linked</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((p) => (
                <ParentRow
                  key={p.id}
                  parent={p}
                  selected={p.id === selectedId}
                  onSelect={onSelect}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No parents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
