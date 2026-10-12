"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function DeleteDepartmentButton({ onClick, disabled }) {
  return <Button type="button" variant="destructive" size="sm" onClick={onClick} disabled={disabled}>Delete</Button>;
}

