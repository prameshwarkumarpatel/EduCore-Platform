"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

export default function ZoomControls({ zoom, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onChange(Math.max(0.5, zoom - 0.1))}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="text-xs text-muted-foreground w-14 text-center">{Math.round(zoom * 100)}%</div>
      <Button variant="outline" size="icon" onClick={() => onChange(Math.min(2, zoom + 0.1))}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onChange(1)}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}

