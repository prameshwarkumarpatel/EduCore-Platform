"use client";
import React from "react";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader({ student }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/20 via-indigo-600/25 to-blue-800/30 p-5 shadow-sm flex items-center gap-4">
      <ProfileAvatar student={student} />
      <div className="min-w-0">
        <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Student Profile</div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white truncate">
          {student?.name || "Student"}
        </h1>
        <div className="mt-1 text-xs text-blue-100/80 flex flex-wrap gap-3">
          <span>Enrollment: {student?.enrollmentId || "—"}</span>
          <span>
            Class: {student?.assignedClass || "—"} / {student?.assignedSection || "—"}
          </span>
          <span>Status: {student?.status || "—"}</span>
        </div>
      </div>
    </div>
  );
}

