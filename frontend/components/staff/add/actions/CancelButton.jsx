"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CancelButton({ onClick, disabled }) {
  return <Button type="button" variant="ghost" onClick={onClick} disabled={disabled}>Cancel</Button>;
}

