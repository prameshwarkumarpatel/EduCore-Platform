"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ViewStaffButton({ onClick }) {
  return <Button type="button" variant="ghost" size="sm" onClick={onClick}>View</Button>;
}

