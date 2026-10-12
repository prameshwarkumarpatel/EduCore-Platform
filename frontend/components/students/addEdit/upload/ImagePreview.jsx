"use client";
import React from "react";

export default function ImagePreview({ src }) {
  if (!src) return null;
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
      <img src={src} alt="Preview" className="w-full max-h-60 object-contain rounded-xl" />
    </div>
  );
}

