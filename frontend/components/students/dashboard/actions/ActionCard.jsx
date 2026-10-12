"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ActionCard({ title, description, icon: Icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border border-border/60 bg-background/40 p-4 hover:bg-muted/40 transition-colors",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-2">
          <Icon className="h-5 w-5 text-teal-300" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        </div>
      </div>
    </button>
  );
}

