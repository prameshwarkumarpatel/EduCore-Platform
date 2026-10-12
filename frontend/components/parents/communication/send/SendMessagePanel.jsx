"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MessageInput from "./MessageInput";
import RecipientSelector from "./RecipientSelector";

export default function SendMessagePanel({
  parentId,
  recipients,
  onRecipientsChange,
  channel,
  onChannelChange,
  message,
  onMessageChange,
  onSend,
  busy,
  disabled,
}) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-amber-100/90">Send Message</div>
          <div className="mt-1 text-sm text-amber-100/70">
            Compose and send to selected parent(s).
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <MessageInput
          channel={channel}
          onChannelChange={onChannelChange}
          message={message}
          onMessageChange={onMessageChange}
        />

        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-muted-foreground">Recipient(s)</div>
          <RecipientSelector
            valueIds={recipients}
            onChange={onRecipientsChange}
            allowMultiple={false}
            placeholder={parentId ? "Search or pick parent..." : "Select parent to send..."}
            disabled={!parentId || disabled}
          />
        </div>

        <Button
          type="button"
          className="w-full gap-2 bg-amber-600 hover:bg-amber-700"
          onClick={onSend}
          disabled={busy || disabled || !parentId}
        >
          <Send className="h-4 w-4" />
          {busy ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

