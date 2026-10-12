"use client";
import React from "react";
import StudentCard from "./StudentCard";

export default function StudentList({ students }) {
  const list = Array.isArray(students) ? students : [];
  if (!list.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
        No linked students.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {list.map((s) => (
        <StudentCard key={s.id} student={s} />
      ))}
    </div>
  );
}
