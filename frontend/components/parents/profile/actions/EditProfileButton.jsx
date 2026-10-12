"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function EditProfileButton({ onClick, disabled }) {
  return (
    <Button variant="outline" onClick={onClick} disabled={disabled} className="gap-2">
      <Pencil className="h-4 w-4" />
      Edit Profile
    </Button>
  );
}
