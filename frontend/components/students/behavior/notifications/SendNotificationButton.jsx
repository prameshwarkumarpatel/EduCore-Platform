"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { behaviorApi } from "@/services/api/behaviorApi";
import { BellRing } from "lucide-react";

export default function SendNotificationButton({ studentId, incidentId, onSent }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setError("");
    if (!studentId) return setError("Select a student first.");
    setBusy(true);
    try {
      const res = await behaviorApi.notifyParent({
        studentId,
        incidentId,
        channel: "SMS",
        message: "Parent notification: behavior incident update.",
      });
      onSent?.(res);
    } catch (e) {
      setError(e?.message || "Failed to notify parent.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={send} disabled={busy} className="w-full gap-2">
        <BellRing className="h-4 w-4" />
        {busy ? "Sending..." : "Notify Parent"}
      </Button>
      {error ? <div className="text-sm text-rose-300">{error}</div> : null}
    </div>
  );
}

