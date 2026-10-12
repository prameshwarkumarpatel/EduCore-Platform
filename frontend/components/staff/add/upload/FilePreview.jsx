"use client";
import React from "react";

export default function FilePreview({ src }) {
  if (!src) {
    return <div className="h-24 w-24 rounded-xl border border-dashed grid place-items-center text-xs text-muted-foreground">No Photo</div>;
  }
  return <img src={src} alt="Profile" className="h-24 w-24 rounded-xl object-cover border" />;
}

