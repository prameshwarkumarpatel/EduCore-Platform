"use client";
import React from "react";
import StudentStatusBadge from "./StudentStatusBadge";
import { useRouter } from "next/navigation";

export default function StudentRow({ student, selected, onSelect, onQuickView }) {
  const router = useRouter();
  return (
    <tr
      className={`border-b transition-colors ${selected ? "bg-primary/10" : "hover:bg-muted/40"}`}
    >
      <td className="px-5 py-3 text-xs font-semibold text-muted-foreground">{student.enrollmentId || "—"}</td>
      <td className="px-5 py-3">
        <button onClick={() => onSelect?.(student)} className="flex items-center gap-3 text-left">
          {student?.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student?.name || "Student"}
              className="h-9 w-9 rounded-full border border-primary/20 object-cover bg-primary/5"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {(student.name || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">{student.name}</div>
            <div className="text-xs text-muted-foreground truncate">{student.email || "—"}</div>
          </div>
        </button>
      </td>
      <td className="px-5 py-3 text-sm text-foreground">
        {student.assignedClass || "—"} / {student.assignedSection || "—"}
      </td>
      <td className="px-5 py-3">
        <StudentStatusBadge status={student.status} />
      </td>
      <td className="px-5 py-3 text-right">
        <button
          onClick={() => onQuickView?.(student)}
          className="mr-3 text-xs font-bold text-primary hover:underline"
        >
          Quick View
        </button>
        <button
          onClick={() => router.push(`/students/profile?id=${student.id}`)}
          className="text-xs font-bold text-blue-400 hover:underline"
        >
          View Profile
        </button>
      </td>
    </tr>
  );
}

