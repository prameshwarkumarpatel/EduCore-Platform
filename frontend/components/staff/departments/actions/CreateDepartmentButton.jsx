"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function CreateDepartmentButton({ onClick, disabled }) {
  return <Button type="button" onClick={onClick} disabled={disabled}>Create</Button>;
}

