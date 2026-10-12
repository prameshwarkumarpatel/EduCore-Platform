"use client";
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ZoomControls from "./ZoomControls";

function isPdf(url) {
  return /\.pdf($|\?)/i.test(url || "");
}
function isImage(url) {
  return /\.(png|jpg|jpeg|webp|gif)($|\?)/i.test(url || "");
}

export default function DocumentViewer({ doc, zoom, onZoom }) {
  const url = doc?.fileUrl || "";
  const mode = useMemo(() => {
    if (!url) return "none";
    if (isPdf(url)) return "pdf";
    if (isImage(url)) return "image";
    return "link";
  }, [url]);

  return (
    <Card className="bg-gradient-to-br from-fuchsia-600/90 to-purple-700/90 text-white border-none shadow-lg">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black tracking-widest uppercase opacity-80">Document Viewer</div>
            <div className="text-lg font-extrabold tracking-tight mt-1">
              {doc ? `${doc.type} · ${doc.applicantName}` : "Select a document"}
            </div>
            <div className="text-xs opacity-80">{doc?.fileName || (url ? url : "No file uploaded yet")}</div>
          </div>
          <div className="shrink-0">
            <ZoomControls zoom={zoom} onChange={onZoom} />
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-black/20 p-3 overflow-auto max-h-[520px]">
          {doc ? (
            mode === "pdf" ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                <iframe
                  title="pdf"
                  src={url}
                  className="w-[900px] h-[520px] rounded-lg bg-white"
                />
              </div>
            ) : mode === "image" ? (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                <img src={url} alt="document" className="rounded-lg max-w-[900px]" />
              </div>
            ) : mode === "link" ? (
              <div className="text-xs">
                Preview not available for this file type. Open:
                <a className="underline ml-1" href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </div>
            ) : (
              <div className="text-xs opacity-80">
                No file uploaded for this document yet. You can still add remarks and mark it verified/rejected.
              </div>
            )
          ) : (
            <div className="text-xs opacity-80">Select a document from the list to preview it here.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

