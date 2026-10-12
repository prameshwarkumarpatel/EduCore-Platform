"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Sparkles } from "lucide-react";

export default function EnrollmentActionsPanel({ onConvert, disabled }) {
  const [applicationId, setApplicationId] = useState("");

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Enrollment Actions</div>
        <Sparkles className="h-4 w-4 text-emerald-300" />
      </div>

      <div className="rounded-xl border border-border/60 bg-background/40 p-3">
        <div className="text-xs font-semibold text-muted-foreground mb-2">Convert approved application → student record</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="Paste approved Application ID"
          />
          <Button
            onClick={() => onConvert?.(applicationId.trim())}
            disabled={disabled || !applicationId.trim()}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Convert
          </Button>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Tip: Copy an Application ID from the Approval queue (approved + assigned class/section).
        </div>
      </div>
    </div>
  );
}

