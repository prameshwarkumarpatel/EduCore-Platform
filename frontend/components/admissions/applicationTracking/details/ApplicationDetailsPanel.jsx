"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicationDetailsPanel({ app }) {
  if (!app) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        Select an application from the list to view details.
      </div>
    );
  }

  const submitted = app.submittedAt ? new Date(app.submittedAt) : null;

  return (
    <Card className="bg-gradient-to-br from-purple-600/90 to-indigo-700/90 text-white border-none shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-widest uppercase opacity-80">
              Application
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-1">
              {app.applicantName}
            </div>
            <div className="text-sm opacity-90">{app.program}</div>
          </div>
          <div className="text-right text-xs opacity-80">
            <div>Status: {app.status}</div>
            <div>
              {submitted ? submitted.toLocaleString() : "Unknown date"}
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/15 p-4 text-xs space-y-1.5">
          <div className="font-semibold">Contact</div>
          <div>{app.applicantEmail}</div>
        </div>
      </CardContent>
    </Card>
  );
}

