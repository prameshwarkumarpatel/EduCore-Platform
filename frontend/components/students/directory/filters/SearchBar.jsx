"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search by name, enrollment ID, email..."
        className="pl-10"
      />
    </div>
  );
}

