"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CalendarSearch, CalendarCog, CalendarHeart, CalendarRange, ListChecks } from "lucide-react";

const SECTIONS = [
  { id: "list", label: "Year List", icon: CalendarSearch, tone: "from-sky-500 to-indigo-600" },
  { id: "edit", label: "Create / Edit", icon: CalendarCog, tone: "from-emerald-500 to-lime-500" },
  { id: "dates", label: "Date Range", icon: CalendarRange, tone: "from-amber-400 to-yellow-500" },
  { id: "semesters", label: "Terms / Semesters", icon: ListChecks, tone: "from-fuchsia-500 to-purple-600" },
  { id: "status", label: "Status & Active", icon: CalendarHeart, tone: "from-orange-500 to-rose-500" },
];

export default function AcademicSidebar({ activeSection, onSelectSection }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sticky top-6">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground px-2">Timeline Controls</div>
      <div className="mt-3 space-y-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectSection(s.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                isActive ? "border-primary/30 bg-primary/5" : "border-muted hover:bg-muted/40"
              )}
            >
              <div className={cn("rounded-xl p-2 text-white shadow bg-gradient-to-br", s.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">Open panel</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

