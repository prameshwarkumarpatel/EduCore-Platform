"use client";
import React from "react";

export default function MessageInput({ channel, onChannelChange, message, onMessageChange }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-muted-foreground">Channel</div>
        <select
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={channel}
          onChange={(e) => onChannelChange?.(e.target.value)}
        >
          <option value="SMS">SMS</option>
          <option value="Email">Email</option>
          <option value="Push">App (Push)</option>
        </select>
      </div>
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-muted-foreground">Message</div>
        <textarea
          value={message}
          onChange={(e) => onMessageChange?.(e.target.value)}
          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Type your message..."
        />
        <div className="text-[11px] text-muted-foreground">{(message || "").length}/1000</div>
      </div>
    </div>
  );
}

