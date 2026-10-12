"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function QuickActionCard({ title, onClick }) {
  return (
    <Button variant="outline" className="justify-start w-full" onClick={onClick}>
      {title}
    </Button>
  );
}

