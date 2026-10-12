"use client";
import React from "react";

export default function NotificationPreview({ channel, to, message }) {
  return (
    <div className="rounded-xl border border-white/15 bg-black/20 p-4 text-xs space-y-1.5">
      <div className="text-xs font-black tracking-widest uppercase opacity-80">Preview</div>
      <div className="opacity-90">
        <span className="font-semibold">Channel:</span> {channel}
      </div>
      <div className="opacity-90">
        <span className="font-semibold">To:</span> {to || "—"}
      </div>
      <div className="opacity-90 whitespace-pre-wrap">{message || "No message."}</div>
    </div>
  );
}

