"use client";
import React from "react";
import MessageInput from "../send/MessageInput";
import RecipientSelector from "../send/RecipientSelector";

export default function BroadcastForm({
  recipients,
  onRecipientsChange,
  channel,
  onChannelChange,
  message,
  onMessageChange,
  parentId,
  disabled,
}) {
  return (
    <div className="space-y-4">
      <MessageInput
        channel={channel}
        onChannelChange={onChannelChange}
        message={message}
        onMessageChange={onMessageChange}
      />
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-muted-foreground">Recipients</div>
        <RecipientSelector
          valueIds={recipients}
          onChange={onRecipientsChange}
          allowMultiple={true}
          placeholder={parentId ? "Search and select multiple parents..." : "Select recipients..."}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

