"use client";
import React from "react";
import ApplicationCard from "./ApplicationCard";

export default function RecentApplicationsPanel({ applications }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Recent Applications
          </div>
          <div className="text-sm text-muted-foreground">
            Latest submissions entering the funnel.
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {applications && applications.length ? (
          applications.map((a) => <ApplicationCard key={a.id} app={a} />)
        ) : (
          <div className="text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-card/70">
            No applications yet for this period.
          </div>
        )}
      </div>
    </div>
  );
}

