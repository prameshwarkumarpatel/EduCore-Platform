"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function EditMedicalRecordButton({ onClick, disabled }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled} className="gap-2">
      <Pencil className="h-4 w-4" />
      Edit
    </Button>
  );
}

