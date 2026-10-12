"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function AcademicYearFilter({ search, onSearch }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Academic Years</div>
          <div className="text-sm text-muted-foreground mt-1">
            Search by label, e.g. <span className="font-semibold text-foreground">2026-2027</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => onSearch("")}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="mt-3 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search academic year..."
          className="pl-10 bg-background/60"
        />
      </div>
    </div>
  );
}

