"use client";
import React from "react";
import Link from "next/link";
import StudentList from "../students/StudentList";

export default function LinkedStudentsSection({ parent }) {
  const students = parent?.linkedStudents || [];
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Linked Students</div>
        {parent?.id && (
          <Link href={`/parents/linked-students?id=${parent.id}`} className="text-xs text-primary hover:underline">
            Manage Links
          </Link>
        )}
      </div>
      <StudentList students={students} />
    </div>
  );
}
