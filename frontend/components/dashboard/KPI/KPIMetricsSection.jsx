"use client";
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Banknote, TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, growth, isUp }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value || '...'}</div>
      <p className={`text-xs mt-1 ${isUp !== false ? 'text-emerald-500' : 'text-destructive'}`}>
        {growth || ''} from last month
      </p>
    </CardContent>
  </Card>
);

export default function KPIMetricsSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardApi.fetchKPIMetrics()
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
      <MetricCard title="Total Students" value={data?.students?.total} growth={data?.students?.growth} isUp={true} icon={Users} />
      <MetricCard title="Total Teachers" value={data?.teachers?.total} growth={data?.teachers?.growth} isUp={true} icon={GraduationCap} />
      <MetricCard title="Revenue (MTD)" value={data?.revenue?.total} growth={data?.revenue?.growth} isUp={true} icon={Banknote} />
      <MetricCard title="Avg. Attendance" value={data?.attendance?.total} growth={data?.attendance?.growth} isUp={data?.attendance?.isUp} icon={TrendingUp} />
    </div>
  );
}
