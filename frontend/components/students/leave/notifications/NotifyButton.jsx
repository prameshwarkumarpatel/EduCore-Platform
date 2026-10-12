"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";

export default function NotifyButton({ onNotify, disabled }) {
  const [message, setMessage] = useState("Leave status update sent to guardians.");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      await onNotify?.(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        disabled={disabled}
      />
      <Button onClick={send} disabled={disabled || busy} className="gap-2 w-full">
        <BellRing className="h-4 w-4" />
        {busy ? "Sending..." : "Send Notification"}
      </Button>
    </div>
  );
}

