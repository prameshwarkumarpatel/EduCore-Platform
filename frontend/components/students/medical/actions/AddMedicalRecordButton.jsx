"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddMedicalRecordButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} className="gap-2">
      <Plus className="h-4 w-4" />
      Add Record
    </Button>
  );
}

