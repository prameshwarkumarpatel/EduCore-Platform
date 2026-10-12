"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function SaveStaffButton({ onClick, disabled }) {
  return <Button type="button" onClick={onClick} disabled={disabled}>Save</Button>;
}

