"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function AcademicTopbar({ onRefresh, loading }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Curriculum, lesson planning, materials, homework, and performance in one place.
        </p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
