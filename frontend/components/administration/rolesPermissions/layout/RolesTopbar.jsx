"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus } from "lucide-react";

export default function RolesTopbar({ onCreateRole, total }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-black tracking-widest uppercase text-muted-foreground">Security &amp; Access</div>
          <div className="text-2xl font-extrabold tracking-tight text-foreground">Roles &amp; Permissions Grid</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Active roles: <span className="font-semibold text-foreground">{total}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button
          onClick={onCreateRole}
          className="gap-2 w-full md:w-auto bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>
    </div>
  );
}

