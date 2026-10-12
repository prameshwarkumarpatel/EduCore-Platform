"use client";
import React from "react";
import { MessageSquare, Phone, Bell } from "lucide-react";

function StatItem({ label, value, icon: Icon, className }) {
  return (
    <div className={`rounded-2xl border bg-background/30 p-4 shadow-sm ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">{label}</div>
        <div className="rounded-xl border bg-background/60 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{value ?? "—"}</div>
    </div>
  );
}

export default function ParentStatsPanel({ stats }) {
  const s = stats || {};
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">Communication Summary</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatItem label="Messages" value={s.messages} icon={MessageSquare} />
        <StatItem label="Calls" value={s.calls} icon={Phone} />
        <StatItem label="Pending Updates" value={s.updatesPending} icon={Bell} />
      </div>
    </div>
  );
}

