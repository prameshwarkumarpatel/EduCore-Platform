"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ReassignClassButton({ onClick, disabled }) {
  return <Button type="button" size="sm" variant="outline" onClick={onClick} disabled={disabled}>Reassign</Button>;
}

