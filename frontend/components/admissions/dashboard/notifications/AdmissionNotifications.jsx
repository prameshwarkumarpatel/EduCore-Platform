"use client";
import React from "react";
import NotificationItem from "./NotificationItem";

export default function AdmissionNotifications({ notifications }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-red-600/90 to-rose-600/90 p-5 shadow-lg text-white">
      <div className="text-xs font-black tracking-widest uppercase opacity-80 mb-2">
        Notifications
      </div>
      <div className="space-y-2">
        {notifications && notifications.length ? (
          notifications.map((n) => <NotificationItem key={n.id} item={n} />)
        ) : (
          <div className="text-xs opacity-80">No critical admission alerts right now.</div>
        )}
      </div>
    </div>
  );
}

