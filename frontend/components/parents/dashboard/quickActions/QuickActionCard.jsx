"use client";
import React from "react";

export default function QuickActionCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border bg-background/30 p-4 text-left hover:bg-muted/30 transition-colors shadow-sm"
    >
      <div className="text-sm font-bold text-foreground">{title}</div>
      <div className="text-[12px] text-muted-foreground mt-1">{description}</div>
    </button>
  );
}

