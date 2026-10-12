"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function DeleteClassButton({ onClick }) {
  return <Button size="sm" variant="destructive" onClick={onClick}>Delete</Button>;
}
