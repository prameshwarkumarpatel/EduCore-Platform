"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CancelEditButton({ onClick, disabled }) {
  return (
    <Button variant="ghost" onClick={onClick} disabled={disabled} className="gap-2">
      <X className="h-4 w-4" />
      Cancel
    </Button>
  );
}

