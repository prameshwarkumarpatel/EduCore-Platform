"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, ShieldCheck, UserCog, Database } from 'lucide-react';

const ActivityIcon = ({ type }) => {
  const styles = "p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0 border";
  switch(type) {
    case 'security': return <div className={`${styles} bg-teal-100 border-teal-200 text-teal-700`}><ShieldCheck className="w-4 h-4" /></div>;
    case 'user': return <div className={`${styles} bg-blue-100 border-blue-200 text-blue-700`}><UserCog className="w-4 h-4" /></div>;
    case 'system': return <div className={`${styles} bg-purple-100 border-purple-200 text-purple-700`}><Database className="w-4 h-4" /></div>;
    default: return <div className={`${styles} bg-gray-100 border-gray-200 text-gray-700`}><Activity className="w-4 h-4" /></div>;
  }
};

const ActivityItem = ({ act }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors">
    <ActivityIcon type={act.type} />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-teal-950 text-sm">{act.action}</p>
      <p className="text-xs text-teal-800/70 mt-0.5 truncate">{act.subject}</p>
    </div>
    <span className="text-[10px] font-medium text-teal-700 bg-white/60 px-2 py-1 rounded-full whitespace-nowrap">
      {act.time}
    </span>
  </div>
);

export default function AdminActivityPanel({ activities }) {
  return (
    <Card className="h-full bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200/40 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl -mr-20 -mt-20" />
      <CardHeader>
        <CardTitle className="text-teal-900 text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          Recent Administrative Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 relative z-10">
          {activities && activities.length > 0 ? (
            activities.map(act => <ActivityItem key={act.id} act={act} />)
          ) : (
             <div className="text-teal-700/60 text-sm py-4">No recent activities properly tracked.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
