"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BellRing, AlertTriangle, Settings, UserPlus } from 'lucide-react';

const NotificationItem = ({ notif }) => {
  const getIcon = () => {
    switch(notif.type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-rose-100" />;
      case 'system': return <Settings className="w-4 h-4 text-rose-100" />;
      case 'action': return <UserPlus className="w-4 h-4 text-rose-100" />;
      default: return <BellRing className="w-4 h-4 text-rose-100" />;
    }
  };

  return (
    <div className={`p-4 rounded-xl flex gap-3 items-start border backdrop-blur-sm transition-all ${
      notif.isRead 
      ? 'bg-rose-950/20 border-rose-800/30 text-rose-200/70' 
      : 'bg-rose-900/40 border-rose-400/30 text-rose-50 shadow-sm shadow-rose-900/20'
    }`}>
      <div className={`mt-0.5 p-1.5 rounded-md ${notif.isRead ? 'bg-rose-900/50' : 'bg-rose-500/80 shadow-inner'}`}>
        {getIcon()}
      </div>
      <div>
        <h4 className="text-sm font-bold tracking-tight">{notif.title}</h4>
        <p className={`text-xs mt-1 ${notif.isRead ? 'text-rose-300/60' : 'text-rose-100/90'}`}>
          {notif.message}
        </p>
      </div>
    </div>
  );
};

export default function AdminNotifications({ notifications }) {
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <Card className="h-full bg-gradient-to-br from-rose-600 to-pink-600 border-none shadow-lg relative overflow-hidden">
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl opacity-50" />
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-white text-lg font-bold flex items-center gap-2 tracking-tight">
          <BellRing className="w-5 h-5 text-pink-200" />
          System Alerts
        </CardTitle>
        {unreadCount > 0 && (
          <span className="bg-white text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {unreadCount} New
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        {notifications && notifications.length > 0 ? (
          notifications.map(n => <NotificationItem key={n.id} notif={n} />)
        ) : (
          <div className="text-rose-200 text-sm text-center py-6">All caught up!</div>
        )}
      </CardContent>
    </Card>
  );
}
