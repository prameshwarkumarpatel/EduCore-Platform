"use client";
import React from "react";
import ProfileAvatar from "./ProfileAvatar";
import ParentStatusBadge from "@/components/parents/directory/table/ParentStatusBadge";

export default function ProfileHeader({ parent }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/20 via-indigo-600/25 to-blue-800/30 p-5 shadow-sm flex items-center gap-4">
      <ProfileAvatar parent={parent} />
      <div className="min-w-0">
        <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Parent Profile</div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white truncate">
          {parent?.name || "Parent"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <ParentStatusBadge status={parent?.status} />
          <span className="text-xs text-blue-100/80">{parent?.relationship || "Guardian"}</span>
          {parent?.linkedStudents?.length != null && (
            <span className="text-xs text-blue-100/80">
              {parent.linkedStudents.length} linked student{parent.linkedStudents.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
