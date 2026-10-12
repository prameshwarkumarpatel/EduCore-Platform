"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, List, FileText, CalendarDays } from "lucide-react";
import ActionCard from "./ActionCard";

export default function StudentQuickActions() {
  const router = useRouter();
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">Quick Actions</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActionCard
          title="Add Student"
          description="Create a new student profile"
          icon={UserPlus}
          onClick={() => router.push("/students/add-edit")}
        />
        <ActionCard
          title="Student Directory"
          description="Browse and manage student records"
          icon={List}
          onClick={() => router.push("/students/directory")}
        />
        <ActionCard
          title="Attendance"
          description="View attendance module (coming next)"
          icon={CalendarDays}
          onClick={() => router.push("/dashboard#activities")}
        />
        <ActionCard
          title="Reports"
          description="Generate student analytics reports"
          icon={FileText}
          onClick={() => router.push("/dashboard#kpi")}
        />
      </div>
    </div>
  );
}

