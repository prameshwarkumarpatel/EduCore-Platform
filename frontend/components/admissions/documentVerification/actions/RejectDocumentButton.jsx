"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function RejectDocumentButton({ onClick, disabled }) {
  return (
    <Button
      disabled={disabled}
      variant="outline"
      className="gap-2 text-rose-500 border-rose-400 hover:bg-rose-500/10"
      onClick={onClick}
    >
      <XCircle className="h-4 w-4" />
      Reject
    </Button>
  );
}

