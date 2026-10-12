"use client";
import React from "react";
import RoleCard from "./RoleCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function RolesListPanel({ roles, selectedRoleId, onSelect, search, onSearch }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Roles</div>
          <div className="text-sm text-muted-foreground mt-1">
            Showing <span className="font-semibold text-foreground">{roles.length}</span> roles
          </div>
        </div>
      </div>

      <div className="mt-3 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search role name or module..."
          className="pl-10 bg-background/60"
        />
      </div>

      <div className="mt-4 space-y-3 max-h-[760px] overflow-y-auto pr-2 custom-scrollbar">
        {roles.map((r) => (
          <RoleCard key={r.id} role={r} selected={r.id === selectedRoleId} onSelect={onSelect} />
        ))}
        {roles.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground border-2 border-dashed rounded-2xl p-10 bg-background/30">
            No roles found for the current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}

