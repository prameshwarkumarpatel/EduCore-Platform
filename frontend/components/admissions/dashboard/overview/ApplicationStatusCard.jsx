"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_COLORS = {
  Pending: "from-amber-400 to-yellow-500",
  Approved: "from-emerald-500 to-lime-500",
  Rejected: "from-rose-500 to-red-600",
};

export default function ApplicationStatusCard({ label, count, status }) {
  const gradient = STATUS_COLORS[status] || "from-slate-500 to-slate-700";

  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white border-none shadow-md`}>
      <CardContent className="p-4 space-y-1.5">
        <div className="text-xs font-black tracking-widest uppercase opacity-80">{label}</div>
        <div className="text-2xl font-extrabold tracking-tight">{count}</div>
        <div className="text-[11px] opacity-85">
          {status === "Pending" && "Awaiting review."}
          {status === "Approved" && "Accepted into programs."}
          {status === "Rejected" && "Not admitted this cycle."}
        </div>
      </CardContent>
    </Card>
  );
}

