"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function QuickViewButton({ onClick, disabled }) {
  return (
    <Button variant="outline" onClick={onClick} disabled={disabled} className="gap-2">
      <Eye className="h-4 w-4" />
      Quick View
    </Button>
  );
}

