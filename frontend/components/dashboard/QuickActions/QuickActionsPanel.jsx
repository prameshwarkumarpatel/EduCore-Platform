"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, BadgeCheck } from 'lucide-react';
import { dashboardApi } from '@/services/api/dashboardApi';
import { useRouter } from 'next/navigation';

const QuickActionCard = ({ title, icon: Icon, onClick }) => (
  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center justify-center w-full shadow-sm hover:border-primary/50 hover:bg-primary/5" onClick={onClick}>
    <Icon className="w-5 h-5 text-muted-foreground" />
    <span className="text-xs font-semibold whitespace-normal text-center">{title}</span>
  </Button>
);

const QuickActionsGrid = ({ actions }) => (
  <div className="grid grid-cols-2 gap-3">
    {actions.map((act, i) => <QuickActionCard key={i} {...act} />)}
  </div>
);

export default function QuickActionsPanel() {
  const router = useRouter();
  
  const handleAction = async (type) => {
    try {
      await dashboardApi.sendQuickAction(type, { timestamp: new Date().toISOString() });
      if (type === 'admission') router.push('/admissions/new-application');
      else if (type === 'id_card') router.push('/dashboard/id-cards');
      else if (type === 'report') router.push('/dashboard#kpi');
      else router.push('/dashboard#activities');
    } catch (e) {
      console.error(e);
    }
  };

  const actions = [
    { title: 'New Admission', icon: UserPlus, onClick: () => handleAction('admission') },
    { title: 'Create ID Card', icon: BadgeCheck, onClick: () => handleAction('id_card') },
    { title: 'Generate Report', icon: FileText, onClick: () => handleAction('report') },
    { title: 'View Circulars', icon: FileText, onClick: () => handleAction('circulars') },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickActionsGrid actions={actions} />
      </CardContent>
    </Card>
  );
}
