"use client";
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell, AlertCircle } from 'lucide-react';

const NotificationItem = ({ notification, onToggleRead }) => (
  <button
    onClick={() => onToggleRead?.(notification)}
    className={`w-full text-left p-3 rounded-lg border flex gap-3 items-start transition-colors ${
      notification.isRead ? 'bg-background hover:bg-muted/40' : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
    }`}
  >
    {notification.type === 'alert' ? <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" /> : <Bell className="w-4 h-4 text-blue-500 mt-0.5" />}
    <div>
      <h4 className="text-sm font-medium">{notification.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
    </div>
  </button>
);

const NotificationList = ({ notifications, onToggleRead }) => (
  <div className="space-y-3">
    {notifications.map((n) => <NotificationItem key={n.id} notification={n} onToggleRead={onToggleRead} />)}
  </div>
);

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    dashboardApi.fetchNotifications()
      .then(res => setNotifications(res.notifications || []))
      .catch(err => setError(err?.message || "Failed to load notifications."));
  }, []);

  const toggleRead = async (n) => {
    if (!n?.id) return;
    setBusyId(n.id);
    setError("");
    try {
      await dashboardApi.markNotificationRead(n.id, !n.isRead);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: !n.isRead } : x)));
    } catch (e) {
      setError(e?.message || "Failed to update notification.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          Notifications
          <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.isRead).length} New
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? <div className="text-sm text-destructive mb-2">{error}</div> : null}
        {busyId ? <div className="text-[11px] text-muted-foreground mb-2">Updating notification…</div> : null}
        {notifications.length > 0 ? (
          <NotificationList notifications={notifications} onToggleRead={toggleRead} />
        ) : (
          <p className="text-sm text-muted-foreground">No new notifications.</p>
        )}
      </CardContent>
    </Card>
  );
}
