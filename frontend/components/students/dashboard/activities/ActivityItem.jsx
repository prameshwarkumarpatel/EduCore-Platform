"use client";
import React from "react";
import { User, CalendarCheck, BookOpen, ShieldAlert } from "lucide-react";

function Icon({ type }) {
  switch (type) {
    case "attendance":
      return <CalendarCheck className="h-4 w-4 text-emerald-300" />;
    case "academic":
      return <BookOpen className="h-4 w-4 text-indigo-300" />;
    case "discipline":
      return <ShieldAlert className="h-4 w-4 text-rose-300" />;
    default:
      return <User className="h-4 w-4 text-sky-300" />;
  }
}

export default function ActivityItem({ item }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="rounded-xl border border-border/60 bg-card p-2">
        <Icon type={item?.type} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">{item?.action || "Activity"}</div>
        <div className="text-xs text-muted-foreground truncate">{item?.subject || item?.student?.name || ""}</div>
      </div>
      <div className="text-[11px] text-muted-foreground whitespace-nowrap">
        {item?.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
      </div>
    </div>
  );
}

