"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SaveChangesButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="gap-2">
      <Check className="h-4 w-4" />
      Save Changes
    </Button>
  );
}
