"use client";
import React from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import { UserSquare2 } from "lucide-react";
import ProfileAvatar from "@/components/students/profile/overview/ProfileAvatar";

export default function StudentProfilePanel({ student }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/15 to-violet-500/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Student Profile</div>
        <div className="rounded-xl border border-border/60 bg-background/50 p-2">
          <UserSquare2 className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>

      {!student ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          Select a student to view profile details.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar student={student} />
            <div className="min-w-0">
              <div className="font-extrabold text-foreground truncate">{student?.name || "—"}</div>
              <div className="text-xs text-muted-foreground truncate">{student?.enrollmentId || ""}</div>
            </div>
          </div>
          <PersonalInfoSection student={student} />
          <AcademicInfoSection student={student} />
          <ContactInfoSection student={student} />
        </div>
      )}
    </div>
  );
}

