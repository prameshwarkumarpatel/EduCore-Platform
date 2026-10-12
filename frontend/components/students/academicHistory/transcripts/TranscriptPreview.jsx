"use client";
import React from "react";

export default function TranscriptPreview({ content }) {
  if (!content) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-background/30">
        Generate a transcript to preview here.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border bg-background/40 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">Preview</div>
      <div className="max-h-80 overflow-auto rounded-xl border border-border/60 bg-card p-4">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

