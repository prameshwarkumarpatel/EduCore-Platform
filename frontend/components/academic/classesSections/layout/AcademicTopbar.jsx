"use client";
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademicTopbar({ onRefresh, loading, search, setSearch }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes & Sections</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage classes, sections, teacher assignment, and capacity tracking.</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search class / section"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
