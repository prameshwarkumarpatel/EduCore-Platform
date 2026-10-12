"use client";
import React from "react";
import StudentRow from "./StudentRow";

export default function StudentsTable({ students, selectedId, onSelect, onQuickView }) {
  const list = Array.isArray(students) ? students : [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/15 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Students Directory</div>
        <div className="text-xs text-muted-foreground">{list.length} students</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Enrollment ID</th>
              <th className="px-5 py-3 font-bold">Student</th>
              <th className="px-5 py-3 font-bold">Class / Section</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((s) => (
                <StudentRow
                  key={s.id}
                  student={s}
                  selected={s.id === selectedId}
                  onSelect={onSelect}
                  onQuickView={onQuickView}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

