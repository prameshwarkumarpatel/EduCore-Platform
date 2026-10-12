"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function UpdateStaffButton({ onClick, disabled }) {
  return <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>Update</Button>;
}

