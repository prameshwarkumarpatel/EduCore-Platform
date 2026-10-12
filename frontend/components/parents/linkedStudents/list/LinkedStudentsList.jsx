"use client";
import React from "react";
import StudentRow from "./StudentRow";

export default function LinkedStudentsList({ students, parentId, onUnlink, onRelationshipChange }) {
  const list = Array.isArray(students) ? students : [];
  if (!list.length) {
    return (
      <div className="rounded-xl border border-dashed border-blue-400/30 bg-blue-500/5 p-8 text-center">
        <p className="text-sm text-muted-foreground">No linked students yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">Use the Link Panel to add students.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {list.map((s) => (
        <StudentRow
          key={s.id}
          student={s}
          parentId={parentId}
          onUnlink={onUnlink}
          onRelationshipChange={onRelationshipChange}
        />
      ))}
    </div>
  );
}
