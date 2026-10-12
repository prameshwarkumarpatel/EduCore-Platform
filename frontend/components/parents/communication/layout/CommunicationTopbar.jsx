"use client";
import React from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunicationTopbar({ parentId, onChangeParentId, onRefresh, loading }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Communication Logs</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Track SMS/Email/App messages, call logs, notifications, and send/broadcast updates to parents.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:items-center">
        {/* Simple parent input so the page works immediately; the full filter panel below refines it. */}
        <input
          value={parentId}
          onChange={(e) => onChangeParentId?.(e.target.value)}
          placeholder="Parent ID"
          className="h-9 w-full sm:w-56 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button variant="outline" onClick={onRefresh} disabled={loading || !parentId} className="shrink-0">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}

