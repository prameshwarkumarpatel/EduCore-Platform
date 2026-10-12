"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, ArrowUpDown } from "lucide-react";

export default function TrackingTopbar({ search, onSearch, onOpenFilters, sort, onSortChange }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Application Tracking</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Browse, filter, and update the status of all applications in the admissions funnel.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or program..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={onOpenFilters}>
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => onSortChange(sort === "date-desc" ? "date-asc" : sort === "date-asc" ? "status" : "date-desc")}
        >
          <ArrowUpDown className="h-4 w-4" />
          {sort === "date-asc" ? "Oldest first" : sort === "status" ? "Sort by status" : "Newest first"}
        </Button>
      </div>
    </div>
  );
}

