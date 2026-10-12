"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function EditStaffButton({ onClick }) {
  return <Button type="button" variant="outline" size="sm" onClick={onClick}>Edit</Button>;
}

