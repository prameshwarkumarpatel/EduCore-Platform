"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import HistoryTimeline from "./HistoryTimeline";

export default function ApprovalHistoryPanel({ history }) {
  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
          Approval History
        </div>
        <HistoryTimeline items={history} />
      </CardContent>
    </Card>
  );
}

