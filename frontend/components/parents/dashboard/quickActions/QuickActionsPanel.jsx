"use client";
import React from "react";
import QuickActionCard from "./QuickActionCard";
import { useRouter } from "next/navigation";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function QuickActionsPanel() {
  const router = useRouter();
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-4 shadow-sm text-white">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">Quick Actions</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickActionCard
          title="Linked Students"
          description="Jump to parent → student mapping"
          onClick={() => scrollToId("linked")}
        />
        <QuickActionCard
          title="Pending Requests"
          description="View action-required items"
          onClick={() => scrollToId("pending")}
        />
        <QuickActionCard
          title="Communication"
          description="Open communication summary"
          onClick={() => scrollToId("communication")}
        />
        <QuickActionCard
          title="Alerts"
          description="See urgent notifications"
          onClick={() => scrollToId("alerts")}
        />
      </div>
      <div className="mt-4 text-[12px] text-muted-foreground">
        Quick actions are context navigation for now.
      </div>
    </div>
  );
}

