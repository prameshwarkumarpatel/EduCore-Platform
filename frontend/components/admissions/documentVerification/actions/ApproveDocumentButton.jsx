"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ApproveDocumentButton({ onClick, disabled }) {
  return (
    <Button
      disabled={disabled}
      className="gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
      onClick={onClick}
    >
      <CheckCircle2 className="h-4 w-4" />
      Approve
    </Button>
  );
}

