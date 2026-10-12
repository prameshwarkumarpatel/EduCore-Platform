"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ContactInfoRow({ contact, onDelete, disabled }) {
  return (
    <div className="rounded-2xl border bg-background/40 p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="font-extrabold text-foreground truncate">{contact.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{contact.phone}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Relationship: <span className="font-semibold text-foreground">{contact.relationship || "Guardian"}</span>
        </div>
        {contact.notes ? <div className="text-xs text-muted-foreground mt-2">{contact.notes}</div> : null}
      </div>
      <div>
        <Button variant="destructive" size="sm" onClick={() => onDelete?.(String(contact._id || contact.id))} disabled={disabled} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

