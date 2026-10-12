"use client";
import React from "react";
import { Bell } from "lucide-react";

export default function NotificationItem({ item }) {
  return (
    <div className="flex gap-3 items-start rounded-lg border border-red-500/20 bg-red-500/5 p-3">
      <div className="mt-0.5">
        <Bell className="h-4 w-4 text-red-400" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-red-200">{item.title}</div>
        <div className="text-[11px] text-red-100/80">{item.message}</div>
      </div>
    </div>
  );
}

