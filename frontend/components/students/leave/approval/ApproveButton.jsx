"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function ApproveButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="gap-2" variant="secondary">
      <Check className="h-4 w-4" />
      Approve
    </Button>
  );
}

