"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationPreview from "./NotificationPreview";

export default function NotificationSender({ app, confirmation, onSend, disabled }) {
  const to = app?.applicantEmail || "";
  const [channel, setChannel] = useState("Email");
  const defaultMsg = useMemo(() => {
    if (!app) return "";
    if (app.status === "Approved") {
      return `Dear ${app.applicantName},\n\nYour admission has been approved for ${app.assignedClass} ${app.assignedSection}.\nConfirmation: ${confirmation?.confirmationCode || app.confirmationCode || "—"}\n\nRegards,\nSchool Administration`;
    }
    if (app.status === "Rejected") {
      return `Dear ${app.applicantName},\n\nWe regret to inform you that your admission application was not approved for this cycle.\n\nRegards,\nSchool Administration`;
    }
    return `Hello ${app.applicantName},\n\nYour application is under review.\n\nRegards,\nSchool Administration`;
  }, [app, confirmation]);

  const [message, setMessage] = useState(defaultMsg);

  useEffect(() => {
    setMessage(defaultMsg);
  }, [defaultMsg]);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-red-600/90 to-rose-600/90 p-4 shadow-lg text-white space-y-3">
      <div className="text-xs font-black tracking-widest uppercase opacity-80">Notification Panel</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-semibold opacity-80 mb-1">Channel</div>
          <select
            disabled={disabled}
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-9 w-full rounded-md border border-white/20 bg-black/20 px-3 text-xs focus-visible:outline-none"
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>
        </div>
        <div>
          <div className="text-xs font-semibold opacity-80 mb-1">To</div>
          <div className="h-9 w-full rounded-md border border-white/20 bg-black/20 px-3 grid items-center text-xs">
            {to || "—"}
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold opacity-80 mb-1">Message</div>
        <textarea
          disabled={disabled}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full rounded-md border border-white/20 bg-black/20 px-3 py-2 text-xs focus-visible:outline-none"
        />
      </div>
      <Button disabled={disabled || !app} onClick={() => onSend({ channel, message })} className="w-full">
        Send notification
      </Button>
      <NotificationPreview channel={channel} to={to} message={message} />
    </div>
  );
}

