"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ViewParentButton({ onClick, disabled }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Eye className="h-4 w-4 mr-1" />
      View
    </Button>
  );
}
