"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import BroadcastForm from "./BroadcastForm";

export default function BroadcastPanel({
  parentId,
  recipients,
  onRecipientsChange,
  channel,
  onChannelChange,
  message,
  onMessageChange,
  onBroadcast,
  busy,
  disabled,
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-orange-100/90">Broadcast</div>
      <div className="mt-1 text-sm text-orange-100/70">Send a message to multiple parents at once.</div>

      <div className="mt-4">
        <BroadcastForm
          recipients={recipients}
          onRecipientsChange={onRecipientsChange}
          channel={channel}
          onChannelChange={onChannelChange}
          message={message}
          onMessageChange={onMessageChange}
          parentId={parentId}
          disabled={disabled}
        />
        <Button
          type="button"
          className="mt-4 w-full gap-2 bg-orange-600 hover:bg-orange-700"
          onClick={onBroadcast}
          disabled={busy || disabled || recipients?.length === 0}
        >
          <Volume2 className="h-4 w-4" />
          {busy ? "Broadcasting..." : "Broadcast"}
        </Button>
      </div>
    </div>
  );
}

