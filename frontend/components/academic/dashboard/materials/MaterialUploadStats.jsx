"use client";
import React from "react";

export default function MaterialUploadStats({ bySubject = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
      {bySubject.slice(0, 6).map((x) => (
        <div key={x.subject} className="rounded-lg border bg-muted/30 px-2 py-1">
          <div className="font-medium">{x.subject}</div>
          <div className="text-muted-foreground">{x.count} files · {x.downloads} dl</div>
        </div>
      ))}
    </div>
  );
}
