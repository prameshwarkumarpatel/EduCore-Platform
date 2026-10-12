"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ActionButtons({ onApprove, onReject, disabled }) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={disabled}
        className="gap-1 bg-emerald-500 text-black hover:bg-emerald-400"
        onClick={onApprove}
      >
        <CheckCircle2 className="h-4 w-4" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        className="gap-1 text-rose-500 border-rose-400 hover:bg-rose-500/10"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4" />
        Reject
      </Button>
    </div>
  );
}

