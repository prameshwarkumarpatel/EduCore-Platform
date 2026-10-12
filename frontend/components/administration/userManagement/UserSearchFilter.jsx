"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

export default function UserSearchFilter({
  searchQuery,
  onSearchQuery,
  role,
  onRole,
  status,
  onStatus,
  roles = [],
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Search & Filter</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSearchQuery("");
            onRole("");
            onStatus("");
          }}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, role..."
            className="pl-10 bg-background/60"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={role}
            onChange={(e) => onRole(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.id || r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex gap-2">
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className="h-9 flex-1 rounded-md border border-input bg-background/60 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="outline" size="icon" className="shrink-0" title="Filters">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

