"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function EditParentButton({ onClick, disabled }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Pencil className="h-4 w-4 mr-1" />
      Edit
    </Button>
  );
}
