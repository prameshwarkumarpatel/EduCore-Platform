"use client";
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/api/dashboardApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useSchoolProfile } from '@/context/SchoolProfileContext';

const WelcomePanel = ({ data, schoolName }) => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight">
      {schoolName ? `Welcome back to ${schoolName} Dashboard` : (data ? data.message : "Welcome back, Admin.")}
    </h2>
    <p className="text-muted-foreground mt-1">Status: {data?.systemStatus || 'Loading...'} | Term: {data?.activeTerm}</p>
  </div>
);

const SystemSummary = ({ onDownload }) => (
  <div className="flex gap-2 mt-4 sm:mt-0">
    <Button variant="outline" className="gap-2" onClick={onDownload}>
      <Download className="w-4 h-4" /> Download Report
    </Button>
  </div>
);

export default function OverviewSection() {
  const [data, setData] = useState(null);
  const { profile } = useSchoolProfile();

  useEffect(() => {
    dashboardApi.fetchOverviewData()
      .then(res => setData(res))
      .catch(err => console.error("Filter Overview fetch error", err));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 w-full">
      <WelcomePanel data={data} schoolName={profile?.name} />
      <SystemSummary onDownload={() => alert("Downloading CSV...")} />
    </div>
  );
}
