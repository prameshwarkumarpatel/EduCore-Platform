"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function RejectButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="gap-2" variant="destructive">
      <X className="h-4 w-4" />
      Reject
    </Button>
  );
}

