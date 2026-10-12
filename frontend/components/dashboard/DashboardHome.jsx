"use client";
import React from 'react';
import OverviewSection from './Overview/OverviewSection';
import KPIMetricsSection from './KPI/KPIMetricsSection';
import RecentActivities from './Activities/RecentActivities';
import NotificationsPanel from './Notifications/NotificationsPanel';
import QuickActionsPanel from './QuickActions/QuickActionsPanel';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <OverviewSection />
      
      <KPIMetricsSection />

      <div className="grid gap-6 md:grid-cols-12 lg:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <RecentActivities />
        </div>
        <div className="md:col-span-4 space-y-6">
          <NotificationsPanel />
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
}
