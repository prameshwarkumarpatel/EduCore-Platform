"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ActionButton({ icon: Icon, label, variant = "outline", onClick }) {
  return (
    <Button
      variant={variant}
      className="w-full justify-start gap-2 text-sm"
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Button>
  );
}

