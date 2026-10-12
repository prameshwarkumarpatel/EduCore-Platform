"use client";
import React from "react";
import { User, Mail, Phone, GraduationCap } from "lucide-react";

export default function StudentRecordPanel({ record }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Student Record</div>

      {!record ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          Select an enrollment record to view student details.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold text-foreground truncate">
                  {record?.student?.name || "Unknown Student"}
                </div>
                <div className="text-xs text-muted-foreground truncate">{record?.enrollmentId}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card px-2.5 py-2 text-xs font-semibold text-muted-foreground">
                {record?.assignedClass || "—"} / {record?.assignedSection || "—"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-4 w-4 text-fuchsia-300" />
                Personal Info
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {record?.student?.name || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-violet-300" />
                Academic Info
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {record?.assignedClass || "—"} • Section {record?.assignedSection || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-4 w-4 text-sky-300" />
                Email
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground truncate">
                {record?.student?.email || "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-4 w-4 text-emerald-300" />
                Phone
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {record?.student?.phone || "—"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Linked Application</div>
            <div className="mt-1 text-xs font-semibold text-foreground break-all">{record?.applicationId || "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}

