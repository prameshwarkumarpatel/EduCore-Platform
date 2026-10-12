"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadTranscriptButton({ content, disabled }) {
  const download = () => {
    const blob = new Blob([content || ""], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "academic-transcript.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} disabled={disabled || !content} className="gap-2">
      <Download className="h-4 w-4" />
      Download
    </Button>
  );
}

