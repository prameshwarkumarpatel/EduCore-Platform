"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchDocuments({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search applicant, doc type, program, app ID..."
        className="pl-10"
      />
    </div>
  );
}

