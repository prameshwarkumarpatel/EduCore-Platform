"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FileBadge2 } from "lucide-react";

export default function ConfirmationGenerator({ confirmation, onGenerate, disabled }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
        Confirmation Generator
      </div>
      <div className="text-xs text-muted-foreground">
        Generate an admission confirmation after approval.
      </div>
      <Button disabled={disabled} onClick={onGenerate} className="gap-2 w-full">
        <FileBadge2 className="h-4 w-4" />
        Generate confirmation
      </Button>
      {confirmation ? (
        <div className="rounded-xl border bg-card p-3 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">Code:</span> {confirmation.confirmationCode}
          </div>
          <div>
            <span className="font-semibold text-foreground">Class:</span> {confirmation.assignedClass}{" "}
            {confirmation.assignedSection}
          </div>
          <div>
            <span className="font-semibold text-foreground">Issued:</span>{" "}
            {new Date(confirmation.issuedAt).toLocaleString()}
          </div>
        </div>
      ) : null}
    </div>
  );
}

