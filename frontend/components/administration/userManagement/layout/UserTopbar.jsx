"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users2 } from "lucide-react";

export default function UserTopbar({ onAddUser, total, activeCount }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-3 text-white shadow">
          <Users2 className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-black tracking-widest uppercase text-muted-foreground">Administration</div>
          <div className="text-2xl font-extrabold tracking-tight text-foreground">Users & Access Control</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{total}</span> · Active:{" "}
            <span className="font-semibold text-foreground">{activeCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button
          onClick={onAddUser}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
}

