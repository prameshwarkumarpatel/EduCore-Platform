"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteParentButton({ onClick, disabled }) {
  return (
    <Button variant="destructive" size="sm" onClick={onClick} disabled={disabled}>
      <Trash2 className="h-4 w-4 mr-1" />
      Delete
    </Button>
  );
}
