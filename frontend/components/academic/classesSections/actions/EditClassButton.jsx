"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function EditClassButton({ onClick }) {
  return <Button size="sm" variant="outline" onClick={onClick}>Edit</Button>;
}
