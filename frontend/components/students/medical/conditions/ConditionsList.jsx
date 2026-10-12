"use client";
import React from "react";
import SeverityBadge from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function ConditionsList({ items = [], onEdit, onDelete, busy }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list.length ? (
        list.map((it) => (
          <div
            key={String(it._id || it.id)}
            className="rounded-2xl border bg-background/40 p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-foreground truncate">{it.condition}</div>
                <div className="text-xs text-muted-foreground mt-1">{it.reaction ? `Reaction: ${it.reaction}` : "—"}</div>
              </div>
              <SeverityBadge severity={it.severity} />
            </div>
            {it.notes ? <div className="text-xs text-muted-foreground">{it.notes}</div> : null}
            <div className="mt-auto flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(it)} disabled={busy} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete?.(String(it._id || it.id))} disabled={busy} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="md:col-span-2 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
          No allergies/conditions found.
        </div>
      )}
    </div>
  );
}

