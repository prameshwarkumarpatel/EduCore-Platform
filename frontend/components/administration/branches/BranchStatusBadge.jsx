"use client";
import React from 'react';
import { cn } from '@/lib/utils';

export default function BranchStatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
      isActive 
        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
        : "bg-orange-50 text-orange-600 border-orange-200"
    )}>
      {status}
    </span>
  );
}
