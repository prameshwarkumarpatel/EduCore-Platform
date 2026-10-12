"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function TotalApplicationsCard({ total }) {
  return (
    <Card className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white border-none shadow-lg">
      <CardContent className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-black tracking-widest uppercase opacity-80">Total Applications</div>
          <Inbox className="h-5 w-5 opacity-80" />
        </div>
        <div className="text-3xl font-extrabold tracking-tight">{total}</div>
        <div className="text-xs opacity-80">All applications received in the selected period.</div>
      </CardContent>
    </Card>
  );
}

