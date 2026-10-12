"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdmissionTrendsChart({ trends }) {
  // Simple bar-like list instead of real chart library to keep dependencies light
  const max = trends?.reduce((m, t) => Math.max(m, t.count), 0) || 1;

  return (
    <Card className="bg-gradient-to-br from-purple-600/90 to-indigo-700/90 text-white border-none shadow-lg">
      <CardContent className="p-5 space-y-3">
        <div className="text-sm font-black tracking-widest uppercase opacity-80">Admission Trends</div>
        <div className="text-xs opacity-80 mb-1">Applications over the last days</div>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {trends && trends.length ? (
            trends.map((t) => {
              const date = new Date(t.date);
              const width = `${(t.count / max) * 100 || 5}%`;
              return (
                <div key={date.toISOString()} className="flex items-center gap-2 text-[11px]">
                  <span className="w-20 shrink-0 opacity-80">
                    {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-white/70" style={{ width }} />
                  </div>
                  <span className="w-6 text-right">{t.count}</span>
                </div>
              );
            })
          ) : (
            <div className="text-xs opacity-80">No trend data yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

