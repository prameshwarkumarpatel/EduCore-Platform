"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SaveDraftButton({ onClick, disabled }) {
  return (
    <Button variant="outline" onClick={onClick} disabled={disabled} className="gap-2">
      <Save className="h-4 w-4" />
      Save Draft
    </Button>
  );
}

