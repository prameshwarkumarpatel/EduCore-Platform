"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ViewAcademicYearDetails({ year }) {
  if (!year) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        Select an academic year to view its full timeline and terms.
      </div>
    );
  }

  const start = year.startDate ? new Date(year.startDate) : null;
  const end = year.endDate ? new Date(year.endDate) : null;
  const semesters = year.semesters || [];

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic Year</div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground mt-1">{year.year}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {start && end ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}` : "No dates configured"}
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div className="font-semibold text-foreground">{year.isActive ? "Active" : year.status || "Inactive"}</div>
            <div>Semesters: {semesters.length}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
            Semesters / terms
          </div>
          {semesters.length === 0 ? (
            <div className="text-xs text-muted-foreground">No terms configured for this year.</div>
          ) : (
            <div className="space-y-2 text-xs text-muted-foreground">
              {semesters.map((s) => {
                const sStart = s.startDate ? new Date(s.startDate) : null;
                const sEnd = s.endDate ? new Date(s.endDate) : null;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background/50 px-3 py-2"
                  >
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div>
                      {sStart && sEnd ? `${sStart.toLocaleDateString()} → ${sEnd.toLocaleDateString()}` : "No dates"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

