"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function SaveChangesButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="gap-2">
      <CheckCircle2 className="h-4 w-4" />
      Save Changes
    </Button>
  );
}

