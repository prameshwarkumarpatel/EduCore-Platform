"use client";
import React from "react";
import { Users } from "lucide-react";

export default function TotalStaffCard({ total }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-indigo-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Total Staff</div>
          <div className="text-3xl font-bold mt-2">{total ?? 0}</div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-blue-500/20 grid place-items-center">
          <Users className="h-6 w-6 text-blue-300" />
        </div>
      </div>
    </div>
  );
}

