"use client";
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Banknote, CalendarDays, FileText } from 'lucide-react';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'student': return <div className="p-2 rounded-full text-blue-500 bg-blue-500/10"><Users className="h-4 w-4" /></div>;
    case 'finance': return <div className="p-2 rounded-full text-emerald-500 bg-emerald-500/10"><Banknote className="h-4 w-4" /></div>;
    case 'attendance': return <div className="p-2 rounded-full text-destructive bg-destructive/10"><CalendarDays className="h-4 w-4" /></div>;
    case 'academic': return <div className="p-2 rounded-full text-primary bg-primary/10"><FileText className="h-4 w-4" /></div>;
    default: return <div className="p-2 rounded-full text-gray-500 bg-gray-500/10"><FileText className="h-4 w-4" /></div>;
  }
};

const ActivityItem = ({ activity }) => (
  <div className="flex items-center gap-4">
    <ActivityIcon type={activity.type} />
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none">{activity.action}</p>
      <p className="text-xs text-muted-foreground">{activity.subject}</p>
    </div>
    <div className="text-xs text-muted-foreground">
      {activity.time ? new Date(activity.time).toLocaleString() : ''}
    </div>
  </div>
);

const ActivityTimeline = ({ activities }) => (
  <div className="space-y-6">
    {activities.map((act) => <ActivityItem key={act.id} activity={act} />)}
  </div>
);

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardApi.fetchRecentActivities()
      .then(res => setActivities(res.activities || []))
      .catch(err => setError(err?.message || "Failed to load activities."));
  }, []);

  return (
    <Card className="col-span-4 h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? <div className="text-sm text-destructive mb-2">{error}</div> : null}
        {activities.length > 0 ? (
          <ActivityTimeline activities={activities} />
        ) : (
          <div className="text-sm text-muted-foreground">No recent activities found.</div>
        )}
      </CardContent>
    </Card>
  );
}
