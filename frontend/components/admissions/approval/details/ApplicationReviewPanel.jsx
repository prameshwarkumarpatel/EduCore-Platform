"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StudentSummary from "./StudentSummary";
import DocumentsSummary from "./DocumentsSummary";

export default function ApplicationReviewPanel({ app }) {
  if (!app) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        Select an application to review and make a final decision.
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
              Application Review
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-1">{app.applicantName}</div>
            <div className="text-sm opacity-90">{app.program}</div>
          </div>
          <div className="text-right text-xs opacity-80">
            <div>Status: {app.status}</div>
            <div>{submitted ? submitted.toLocaleString() : "Unknown date"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StudentSummary app={app} />
          <DocumentsSummary docsSummary={app.docsSummary} />
        </div>
      </CardContent>
    </Card>
  );
}

