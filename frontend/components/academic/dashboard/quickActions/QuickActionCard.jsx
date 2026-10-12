"use client";
import React from "react";
import Link from "next/link";

export default function QuickActionCard({ title, description, href }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border bg-card/50 p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
    </Link>
  );
}
